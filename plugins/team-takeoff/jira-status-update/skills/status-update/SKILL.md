---
name: status-update
description: This skill should be used when the user asks for a "status update", "epic status", "progress report", mentions a Jira epic key (like "TAK-1475"), or wants to generate a report for an epic.
version: 1.0.0
---

# Jira Epic Status Update Skill

Generate comprehensive status updates for Jira Epics with automatic analysis and formatting.

## When to Use

This skill activates when:
- User asks for status update on a Jira epic
- User mentions an epic key (e.g., "TAK-1475", "LUM-123")
- User wants progress report or summary of epic work
- User requests team update in Slack or Markdown format

## How to Use

The skill provides the `/status-update` command:

```
/status-update <EPIC-KEY> [--format=slack|markdown] [--detail=compact|detailed|executive] [--post --channel=#channel]
```

### Examples

```
/status-update TAK-1475
/status-update TAK-1475 --format=markdown
/status-update TAK-1475 --detail=executive
/status-update TAK-1475 --post --channel=#team-updates
/status-update TAK-1475 --post --channel=C1234567890 --detail=compact
```

## Output Formats

### Slack Format (default)
- Uses emojis and formatting optimized for Slack
- Progress bars with visual indicators
- Color-coded status categories
- Compact layout for quick reading

### Markdown Format
- Clean tables for documentation
- Links to Jira issues
- Professional formatting for sharing in docs

## Detail Levels

### Compact (default)
- High-level overview
- Key metrics and blockers
- Top priority items

### Detailed
- Full task breakdown by status
- Individual assignees
- Complete issue lists

### Executive
- Strategic overview
- Focus on risks and timeline
- Minimal task detail

## Features

The command automatically:
- Fetches epic and all sub-tasks from Jira
- Calculates progress percentage
- Identifies blockers and unassigned tasks
- Groups tasks by status
- Highlights at-risk items
- Suggests next steps

## Slack Posting (Optional)

To post the status update to Slack, use the `--post` and `--channel` flags:

```
/status-update TAK-1475 --post --channel=#team-takeoff-status
```

**Available Channels:**
- `#team-takeoff-internal` - Internal team discussions and updates
- `#team-takeoff-status` - Status reports and progress updates

**Tip:** Run the command without `--post` first to preview the update. If satisfied, add `--post --channel=#channel-name` to post it to Slack.

## Requirements

- **leanix-atlassian MCP server** must be connected
- Access to LeanIX Jira workspace (leanix.atlassian.net)
- Valid epic key

## Implementation

The skill uses:
- `EpicAnalyzer` for intelligent task analysis
- `SlackFormatter` for Slack-optimized output
- `MarkdownFormatter` for documentation output
- leanix-atlassian MCP for authenticated Jira API access
