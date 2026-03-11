/**
 * Multi-PR watcher - monitors multiple PRs simultaneously
 */
import { PRFetcher } from "./pr-fetcher.js";
import { EventDetector } from "./event-detector.js";
export class MultiPRWatcher {
    fetcher = new PRFetcher();
    detector = new EventDetector();
    states = new Map();
    /**
     * Initialize watching multiple PRs
     */
    initialize(prNumbers) {
        for (const prNumber of prNumbers) {
            this.states.set(prNumber, {
                prNumber,
                snapshot: null,
                events: [],
                isComplete: false,
            });
        }
    }
    /**
     * Fetch updates for all PRs
     */
    async fetchAll() {
        const allEvents = new Map();
        for (const [prNumber, state] of this.states.entries()) {
            if (state.isComplete) {
                continue;
            }
            try {
                const currentSnapshot = await this.fetcher.fetch(prNumber);
                const events = this.detector.detectChanges(state.snapshot, currentSnapshot);
                state.snapshot = currentSnapshot;
                state.events.push(...events);
                if (events.length > 0) {
                    allEvents.set(prNumber, events);
                }
                // Check if this PR should be marked complete
                if (this.isComplete(currentSnapshot)) {
                    state.isComplete = true;
                }
            }
            catch (error) {
                console.warn(`Failed to fetch PR ${prNumber}:`, error);
            }
        }
        return allEvents;
    }
    /**
     * Check if a PR is complete (merged, closed, or all checks passed)
     */
    isComplete(snapshot) {
        if (snapshot.state === "MERGED" || snapshot.state === "CLOSED") {
            return true;
        }
        const allChecksPassed = snapshot.checks.every((c) => c.conclusion === "success" || c.conclusion === "skipped" || c.conclusion === "neutral");
        const hasApproval = snapshot.reviews.some((r) => r.state === "APPROVED");
        return allChecksPassed && hasApproval;
    }
    /**
     * Check if all PRs are complete
     */
    areAllComplete() {
        return Array.from(this.states.values()).every((state) => state.isComplete);
    }
    /**
     * Get current state for a PR
     */
    getState(prNumber) {
        return this.states.get(prNumber);
    }
    /**
     * Get all states
     */
    getAllStates() {
        return Array.from(this.states.values());
    }
    /**
     * Get summary of all PRs
     */
    getSummary() {
        const lines = [];
        lines.push("");
        lines.push("═══════════════════════════════════════════");
        lines.push(`📊 Multi-PR Summary (${this.states.size} PRs)`);
        lines.push("═══════════════════════════════════════════");
        for (const state of this.states.values()) {
            if (!state.snapshot)
                continue;
            const status = state.isComplete ? "✅" : "⏳";
            const checksPassed = state.snapshot.checks.filter((c) => c.conclusion === "success" || c.conclusion === "skipped").length;
            const totalChecks = state.snapshot.checks.length;
            lines.push(`${status} PR #${state.prNumber}: ${state.snapshot.title}`);
            lines.push(`   Checks: ${checksPassed}/${totalChecks} | Events: ${state.events.length}`);
        }
        lines.push("═══════════════════════════════════════════");
        return lines.join("\n");
    }
}
