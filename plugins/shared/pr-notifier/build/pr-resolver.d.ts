/**
 * PR Resolver - resolves Jira ticket keys to PR numbers
 */
export interface PRResolution {
    prNumber: number;
    title: string;
    branch: string;
    matchedIn: "branch" | "title" | "body";
}
export declare class PRResolver {
    /**
     * Resolve a PR identifier (number or Jira key) to PR number
     */
    resolve(identifier: string): Promise<number>;
    /**
     * Resolve multiple identifiers
     */
    resolveMultiple(identifiers: string[]): Promise<number[]>;
    /**
     * Resolve Jira ticket key to PR number
     */
    private resolveTicketKey;
    /**
     * Get all PRs for a ticket key (in case there are multiple)
     */
    findAllForTicket(ticketKey: string): Promise<PRResolution[]>;
}
