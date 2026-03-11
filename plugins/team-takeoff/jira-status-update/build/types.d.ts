export interface JiraIssue {
    key: string;
    id: string;
    fields: {
        summary: string;
        status: {
            name: string;
            statusCategory: {
                key: string;
                name: string;
            };
        };
        issuetype: {
            name: string;
        };
        assignee?: {
            displayName: string;
            emailAddress: string;
        };
        priority?: {
            name: string;
        };
        created: string;
        updated: string;
        description?: string;
    };
}
export interface EpicAnalysis {
    total: number;
    done: number;
    inProgress: number;
    blocked: number;
    toDo: number;
    progress: number;
    blockers: BlockerInfo[];
    tasksByStatus: Map<string, JiraIssue[]>;
}
export interface BlockerInfo {
    task: JiraIssue;
    reason?: string;
    dependencies?: string[];
}
export type OutputFormat = "slack" | "markdown" | "confluence" | "json";
export type DetailLevel = "compact" | "detailed" | "executive";
