export interface JiraTicket {
    key: string;
    url: string;
}
export interface JiraActionRequest {
    action: string;
    ticketKey: string;
    targetStatus: string;
    prUrl: string;
    comment: string;
}
export declare class JiraIntegration {
    private readonly jiraUrl;
    private readonly cloudId;
    /**
     * Extract Jira ticket key from PR title or branch name
     */
    extractTicketKey(prTitle: string, branchName?: string): string | null;
    /**
     * Get branch name for current PR
     */
    getBranchName(prNumber: number): Promise<string | null>;
    /**
     * Request Jira transition (to be handled by Claude Code via MCP)
     */
    transitionToReview(ticketKey: string, prUrl: string): Promise<JiraActionRequest>;
}
