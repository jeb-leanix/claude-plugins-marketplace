import { JiraIssue, EpicAnalysis } from "./types.js";
export declare class EpicAnalyzer {
    analyze(epic: JiraIssue, subTasks: JiraIssue[]): EpicAnalysis;
    private groupByStatus;
    private countByStatus;
    private identifyBlockers;
    private extractBlockerReason;
    identifyNextSteps(analysis: EpicAnalysis): string[];
}
