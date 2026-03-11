import { JiraIssue, EpicAnalysis, DetailLevel } from "../types.js";
export declare class SlackFormatter {
    private analyzer;
    constructor();
    format(epic: JiraIssue, subTasks: JiraIssue[], analysis: EpicAnalysis, detail: DetailLevel): string;
    private formatCompact;
    private formatDetailed;
    private formatExecutive;
    private formatTaskLine;
    private createProgressBar;
    private getStatusEmoji;
}
