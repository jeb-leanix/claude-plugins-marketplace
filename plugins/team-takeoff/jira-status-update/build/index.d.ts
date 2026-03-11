#!/usr/bin/env node
/**
 * Jira Status Update Skill for Claude
 *
 * This skill generates comprehensive status updates for Jira Epics
 * using the leanix-atlassian MCP server for data access.
 */
import { DetailLevel } from "./types.js";
interface SkillContext {
    mcp: {
        callTool(serverName: string, toolName: string, args: any): Promise<any>;
    };
}
interface StatusUpdateOptions {
    format?: "slack" | "markdown";
    detail?: DetailLevel;
    postToSlack?: boolean;
    slackChannel?: string;
    slackToken?: string;
    confirmed?: boolean;
}
/**
 * Main skill execution function
 */
export declare function execute(context: SkillContext, epicKey: string, options?: StatusUpdateOptions): Promise<string>;
export {};
