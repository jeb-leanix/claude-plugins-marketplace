#!/usr/bin/env node

/**
 * Jira Status Update Skill for Claude
 *
 * This skill generates comprehensive status updates for Jira Epics
 * using the leanix-atlassian MCP server for data access.
 */

import { EpicAnalyzer } from "./analyzer.js";
import { SlackFormatter } from "./formatters/slack.js";
import { MarkdownFormatter } from "./formatters/markdown.js";
import { SlackPoster } from "./slack-poster.js";
import { JiraIssue, DetailLevel } from "./types.js";

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
export async function execute(
  context: SkillContext,
  epicKey: string,
  options: StatusUpdateOptions = {}
): Promise<string> {
  const format = options.format || "slack";
  const detail = options.detail || "compact";

  try {
    // Initialize formatters and analyzer
    const analyzer = new EpicAnalyzer();
    const slackFormatter = new SlackFormatter();
    const markdownFormatter = new MarkdownFormatter();

    // Fetch epic data via leanix-atlassian MCP
    const epicResult = await context.mcp.callTool(
      "leanix-atlassian",
      "searchJiraIssuesUsingJql",
      {
        cloudId: "leanix.atlassian.net",
        jql: `key = ${epicKey}`,
        fields: ["summary", "status", "issuetype", "assignee", "priority", "created", "updated", "description"],
        maxResults: 1,
      }
    );

    if (!epicResult.issues || epicResult.issues.length === 0) {
      return `❌ Epic ${epicKey} not found. Please check the epic key.`;
    }

    const epic: JiraIssue = epicResult.issues[0];

    // Fetch sub-tasks
    const subTasksResult = await context.mcp.callTool(
      "leanix-atlassian",
      "searchJiraIssuesUsingJql",
      {
        cloudId: "leanix.atlassian.net",
        jql: `"Epic Link" = ${epicKey} ORDER BY status ASC, priority DESC`,
        fields: ["summary", "status", "issuetype", "assignee", "priority", "created", "updated", "description"],
        maxResults: 100,
      }
    );

    const subTasks: JiraIssue[] = subTasksResult.issues || [];

    // Analyze
    const analysis = analyzer.analyze(epic, subTasks);

    // Format output
    let output: string;
    if (format === "markdown") {
      output = markdownFormatter.format(epic, subTasks, analysis, detail);
    } else {
      output = slackFormatter.format(epic, subTasks, analysis, detail);
    }

    // Post to Slack if requested
    if (options.postToSlack) {
      const slackToken = options.slackToken || process.env.TAKEOFF_SLACK_BOT_TOKEN;
      const slackChannel = options.slackChannel;

      if (!slackToken) {
        return `❌ Error: Slack token not provided. Set TAKEOFF_SLACK_BOT_TOKEN environment variable or pass --slack-token option.`;
      }

      if (!slackChannel) {
        return `❌ Error: Slack channel not provided. Use --channel option to specify the channel (e.g., #team-updates or C1234567890).`;
      }

      // If not confirmed, return preview with metadata for Claude to use
      if (!options.confirmed) {
        return JSON.stringify({
          action: "preview",
          channel: slackChannel,
          message: output,
        });
      }

      // Actually post to Slack
      const poster = new SlackPoster();
      const result = await poster.post({
        token: slackToken,
        channel: slackChannel,
        text: output,
      });

      if (!result.success) {
        return `❌ Failed to post to Slack: ${result.error}\n\n${output}`;
      }

      return `✅ Status update posted to Slack channel ${slackChannel}\n\n${output}`;
    }

    return output;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return `❌ Error generating status update: ${errorMessage}\n\nPlease ensure:\n- The leanix-atlassian MCP server is connected\n- You have access to the epic ${epicKey}\n- The epic key is correct`;
  }
}

/**
 * CLI interface for direct execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help") {
    console.log(`
Jira Status Update Command

Usage:
  /status-update <EPIC-KEY> [options]

Options:
  --format=<slack|markdown>              Output format (default: slack)
  --detail=<compact|detailed|executive>  Detail level (default: compact)
  --post                                 Post to Slack (requires --channel)
  --channel=<#channel-name|ID>           Slack channel to post to
  --confirmed                            Skip confirmation (used internally after user confirms)
  --slack-token=<token>                  Slack bot token (optional, uses TAKEOFF_SLACK_BOT_TOKEN env var)

Examples:
  /status-update TAK-1475
  /status-update TAK-1475 --format=markdown
  /status-update TAK-1475 --detail=executive
  /status-update TAK-1475 --post --channel=#team-updates
  /status-update TAK-1475 --post --channel=C1234567890 --detail=compact
`);
    process.exit(0);
  }

  console.log("This skill must be run within Claude Code with the leanix-atlassian MCP server available.");
  console.log("Usage: Ask Claude to run '/status-update TAK-1475'");
  process.exit(1);
}
