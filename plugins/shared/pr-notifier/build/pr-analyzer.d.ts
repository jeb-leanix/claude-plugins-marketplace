/**
 * PR Analyzer - detects unusual patterns and provides insights
 */
import { PRSnapshot } from "./types.js";
export interface AnalysisInsight {
    type: "warning" | "info" | "tip";
    message: string;
}
export declare class PRAnalyzer {
    private checkHistory;
    private readonly SLOW_CHECK_THRESHOLD;
    private readonly VERY_SLOW_THRESHOLD;
    /**
     * Analyze PR and provide insights
     */
    analyze(snapshot: PRSnapshot): AnalysisInsight[];
    /**
     * Record check duration for historical analysis
     */
    recordCheckDuration(checkName: string, duration: number): void;
    private analyzeCheckDurations;
    private analyzeReviewStatus;
    private analyzeMergeReadiness;
    private formatDuration;
}
