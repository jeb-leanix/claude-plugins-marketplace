/**
 * Fetches PR data from GitHub using gh CLI
 */
import { execSync } from "child_process";
export class PRFetcher {
    /**
     * Fetch current PR state from GitHub
     */
    async fetch(prNumber) {
        try {
            // Fetch PR details
            const prData = JSON.parse(execSync(`gh pr view ${prNumber} --json number,title,state,isDraft,mergeable,reviewRequests`, {
                encoding: "utf-8",
            }));
            // Fetch check runs
            const checksData = JSON.parse(execSync(`gh pr view ${prNumber} --json statusCheckRollup`, {
                encoding: "utf-8",
            }));
            // Fetch reviews
            const reviewsData = JSON.parse(execSync(`gh api repos/{owner}/{repo}/pulls/${prNumber}/reviews`, {
                encoding: "utf-8",
            }));
            // Fetch comments
            const commentsData = JSON.parse(execSync(`gh api repos/{owner}/{repo}/issues/${prNumber}/comments`, {
                encoding: "utf-8",
            }));
            return {
                number: prData.number,
                title: prData.title,
                state: prData.state,
                isDraft: prData.isDraft,
                mergeable: prData.mergeable,
                checks: this.parseChecks(checksData.statusCheckRollup),
                reviews: this.parseReviews(reviewsData),
                comments: this.parseComments(commentsData),
                reviewers: prData.reviewRequests?.map((r) => r.login) || [],
                timestamp: new Date(),
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch PR ${prNumber}: ${error}`);
        }
    }
    parseChecks(rollup) {
        if (!rollup)
            return [];
        return rollup
            .filter((item) => item.__typename === "CheckRun" || item.__typename === "StatusContext")
            .map((check) => ({
            name: check.name || check.context,
            status: (check.status || check.state)?.toLowerCase(),
            conclusion: check.conclusion?.toLowerCase(),
            startedAt: check.startedAt,
            completedAt: check.completedAt,
            detailsUrl: check.detailsUrl || check.targetUrl,
        }));
    }
    parseReviews(reviews) {
        if (!reviews)
            return [];
        return reviews.map((review) => ({
            id: review.id.toString(),
            author: review.user?.login || "unknown",
            state: review.state,
            submittedAt: review.submitted_at,
            body: review.body,
        }));
    }
    parseComments(comments) {
        if (!comments)
            return [];
        return comments.map((comment) => ({
            id: comment.id.toString(),
            author: comment.user?.login || "unknown",
            body: comment.body,
            createdAt: comment.created_at,
            url: comment.html_url,
        }));
    }
}
