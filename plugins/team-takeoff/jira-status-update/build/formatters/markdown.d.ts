import { JiraIssue, EpicAnalysis, DetailLevel } from "../types.js";
export declare class MarkdownFormatter {
    format(epic: JiraIssue, subTasks: JiraIssue[], analysis: EpicAnalysis, detail: DetailLevel): string;
    private createProgressBar;
}
