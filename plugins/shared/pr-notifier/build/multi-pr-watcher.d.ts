/**
 * Multi-PR watcher - monitors multiple PRs simultaneously
 */
import { PRSnapshot, PREvent } from "./types.js";
export interface MultiPRState {
    prNumber: number;
    snapshot: PRSnapshot | null;
    events: PREvent[];
    isComplete: boolean;
}
export declare class MultiPRWatcher {
    private fetcher;
    private detector;
    private states;
    /**
     * Initialize watching multiple PRs
     */
    initialize(prNumbers: number[]): void;
    /**
     * Fetch updates for all PRs
     */
    fetchAll(): Promise<Map<number, PREvent[]>>;
    /**
     * Check if a PR is complete (merged, closed, or all checks passed)
     */
    private isComplete;
    /**
     * Check if all PRs are complete
     */
    areAllComplete(): boolean;
    /**
     * Get current state for a PR
     */
    getState(prNumber: number): MultiPRState | undefined;
    /**
     * Get all states
     */
    getAllStates(): MultiPRState[];
    /**
     * Get summary of all PRs
     */
    getSummary(): string;
}
