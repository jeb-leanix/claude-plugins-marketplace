/**
 * Detects changes between PR snapshots and generates events
 */
import { PRSnapshot, PREvent } from "./types.js";
export declare class EventDetector {
    /**
     * Compare two snapshots and detect changes
     */
    detectChanges(previous: PRSnapshot | null, current: PRSnapshot): PREvent[];
    private createInitialEvent;
    private detectCheckChanges;
    private detectReviewChanges;
    private detectCommentChanges;
    private detectStatusChanges;
}
