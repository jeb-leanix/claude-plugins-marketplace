/**
 * Detects changes between PR snapshots and generates events
 */
export class EventDetector {
    /**
     * Compare two snapshots and detect changes
     */
    detectChanges(previous, current) {
        if (!previous) {
            return [this.createInitialEvent(current)];
        }
        const events = [];
        // Check status changes
        events.push(...this.detectCheckChanges(previous.checks, current.checks));
        // Review changes
        events.push(...this.detectReviewChanges(previous.reviews, current.reviews));
        // Comment changes
        events.push(...this.detectCommentChanges(previous.comments, current.comments));
        // PR status changes
        events.push(...this.detectStatusChanges(previous, current));
        return events;
    }
    createInitialEvent(snapshot) {
        const totalChecks = snapshot.checks.length;
        const passedChecks = snapshot.checks.filter((c) => c.conclusion === "success" || c.status === "success").length;
        const failedChecks = snapshot.checks.filter((c) => c.conclusion === "failure" || c.status === "failure").length;
        const pendingChecks = snapshot.checks.filter((c) => c.status === "pending" || (!c.conclusion && c.status !== "success")).length;
        let statusText = `Monitoring PR #${snapshot.number}: ${snapshot.title}\n`;
        statusText += `State: ${snapshot.state}${snapshot.isDraft ? " (Draft)" : ""}\n`;
        statusText += `Checks: ${passedChecks} passed, ${failedChecks} failed, ${pendingChecks} pending (${totalChecks} total)\n`;
        statusText += `Reviews: ${snapshot.reviews.length}\n`;
        statusText += `Comments: ${snapshot.comments.length}`;
        return {
            type: "status",
            message: statusText,
            severity: "info",
            timestamp: new Date(),
        };
    }
    detectCheckChanges(previous, current) {
        const events = [];
        for (const check of current) {
            const prev = previous.find((c) => c.name === check.name);
            // New check started
            if (!prev && check.status === "pending") {
                events.push({
                    type: "check",
                    message: `🔄 Check started: ${check.name}`,
                    severity: "info",
                    timestamp: new Date(),
                    details: check,
                });
                continue;
            }
            // Check status changed
            if (prev && prev.conclusion !== check.conclusion && check.conclusion) {
                const emoji = check.conclusion === "success" ? "✅" : check.conclusion === "failure" ? "❌" : "⚠️";
                const severity = check.conclusion === "success" ? "success" : check.conclusion === "failure" ? "error" : "warning";
                events.push({
                    type: "check",
                    message: `${emoji} Check ${check.conclusion}: ${check.name}`,
                    severity,
                    timestamp: new Date(),
                    details: check,
                });
            }
        }
        return events;
    }
    detectReviewChanges(previous, current) {
        const events = [];
        const newReviews = current.filter((r) => !previous.find((p) => p.id === r.id));
        for (const review of newReviews) {
            const emoji = review.state === "APPROVED" ? "✅" :
                review.state === "CHANGES_REQUESTED" ? "🔧" :
                    "💬";
            events.push({
                type: "review",
                message: `${emoji} Review by ${review.author}: ${review.state.replace(/_/g, " ").toLowerCase()}`,
                severity: review.state === "APPROVED" ? "success" : "info",
                timestamp: new Date(),
                details: review,
            });
        }
        return events;
    }
    detectCommentChanges(previous, current) {
        const events = [];
        const newComments = current.filter((c) => !previous.find((p) => p.id === c.id));
        for (const comment of newComments) {
            const preview = comment.body.substring(0, 100) + (comment.body.length > 100 ? "..." : "");
            events.push({
                type: "comment",
                message: `💬 Comment by ${comment.author}: ${preview}`,
                severity: "info",
                timestamp: new Date(),
                details: comment,
            });
        }
        return events;
    }
    detectStatusChanges(previous, current) {
        const events = [];
        // Draft status changed
        if (previous.isDraft && !current.isDraft) {
            events.push({
                type: "status",
                message: "🎯 PR marked as ready for review",
                severity: "success",
                timestamp: new Date(),
            });
        }
        // Merged
        if (previous.state !== "MERGED" && current.state === "MERGED") {
            events.push({
                type: "status",
                message: "🎉 PR merged!",
                severity: "success",
                timestamp: new Date(),
            });
        }
        // Closed
        if (previous.state !== "CLOSED" && current.state === "CLOSED") {
            events.push({
                type: "status",
                message: "🚫 PR closed",
                severity: "warning",
                timestamp: new Date(),
            });
        }
        // Merge conflicts
        if (previous.mergeable !== "CONFLICTING" && current.mergeable === "CONFLICTING") {
            events.push({
                type: "conflict",
                message: "⚠️ Merge conflicts detected",
                severity: "warning",
                timestamp: new Date(),
            });
        }
        return events;
    }
}
