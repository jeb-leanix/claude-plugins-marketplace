/**
 * Generates summary reports for PR monitoring sessions
 */
import { PRSnapshot, PREvent } from "./types.js";
export interface SummaryStats {
    duration: number;
    totalEvents: number;
    checksCompleted: number;
    checksSucceeded: number;
    checksFailed: number;
    reviewsReceived: number;
    commentsAdded: number;
    finalState: string;
    reviewers: string[];
    averageCheckTime?: number;
    longestCheck?: {
        name: string;
        duration: number;
    };
}
export declare class SummaryReporter {
    private startTime;
    private events;
    private checkStartTimes;
    private checkDurations;
    constructor();
    /**
     * Record an event
     */
    recordEvent(event: PREvent): void;
    /**
     * Generate summary report
     */
    generateSummary(finalSnapshot: PRSnapshot): string;
    /**
     * Generate compact summary (for notifications)
     */
    generateCompactSummary(finalSnapshot: PRSnapshot): string;
    private calculateStats;
    private formatFinalState;
    private formatDuration;
}
