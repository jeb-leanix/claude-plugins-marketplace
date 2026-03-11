#!/usr/bin/env node
/**
 * PR Notifier Skill for Claude
 *
 * Monitors GitHub PRs for CI/CD checks, reviews, and comments
 */
import { NotifyFilter, UntilCondition } from "./types.js";
interface SkillContext {
    mcp?: {
        callTool(serverName: string, toolName: string, args: any): Promise<any>;
    };
}
/**
 * Main skill execution function
 */
export declare function execute(context: SkillContext, prIdentifiers: string, options?: {
    notifyOn?: NotifyFilter;
    interval?: string;
    until?: UntilCondition;
    desktop?: boolean;
    noDesktop?: boolean;
    bell?: boolean;
    noJiraTransition?: boolean;
}): Promise<string>;
export {};
