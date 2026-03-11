/**
 * Fetches PR data from GitHub using gh CLI
 */
import { PRSnapshot } from "./types.js";
export declare class PRFetcher {
    /**
     * Fetch current PR state from GitHub
     */
    fetch(prNumber: number): Promise<PRSnapshot>;
    private parseChecks;
    private parseReviews;
    private parseComments;
}
