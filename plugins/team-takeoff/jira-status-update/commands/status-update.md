---
name: status-update
description: Generate a comprehensive status update for a Jira Epic with optional Slack posting
usage: /status-update <EPIC-KEY> [--format=slack|markdown] [--detail=compact|detailed|executive] [--post]
examples:
  - /status-update TAK-1475
  - /status-update TAK-1475 --format=markdown
  - /status-update TAK-1475 --detail=executive
  - /status-update TAK-1475 --post
  - /status-update TAK-1475 --format=markdown --detail=detailed
---

# Generate Jira Epic Status Update

Execute the jira-status-update skill to fetch and analyze the specified epic and all its sub-tasks.

## Parameters

- **EPIC-KEY** (required): The Jira epic key (e.g., TAK-1475, LUM-123)
- **--format** (optional): Output format - `slack` (default) or `markdown`
- **--detail** (optional): Detail level - `compact` (default), `detailed`, or `executive`

## Instructions for Claude

When this command is invoked:

1. **Extract parameters** from the command:
   - Epic key (required, first argument after command name)
   - Format flag: `--format=slack` or `--format=markdown` (default: slack)
   - Detail flag: `--detail=compact|detailed|executive` (default: compact)

2. **Fetch epic data** using leanix-atlassian MCP:
   ```
   mcp__leanix-atlassian__searchJiraIssuesUsingJql({
     cloudId: "leanix.atlassian.net",
     jql: `key = ${epicKey}`,
     fields: ["summary", "status", "issuetype", "assignee", "priority", "created", "updated", "description", "project"],
     maxResults: 1
   })
   ```

3. **Fetch sub-tasks** using leanix-atlassian MCP:
   ```
   mcp__leanix-atlassian__searchJiraIssuesUsingJql({
     cloudId: "leanix.atlassian.net",
     jql: `"Epic Link" = ${epicKey} ORDER BY status ASC, priority DESC`,
     fields: ["summary", "status", "issuetype", "assignee", "priority", "created", "updated", "description"],
     maxResults: 100
   })
   ```

4. **Analyze the data**:
   - Calculate progress: done tasks / total tasks
   - Identify blockers (status = "Blocked")
   - Group tasks by status (To Do, In Progress, In Review, Done, Blocked)
   - Find unassigned tasks
   - Determine next steps based on blockers and in-progress work

5. **Format the output** based on requested format and detail level:

   ### Slack Format (default):
   ```
   # 📊 Status Update: {epic-key} - {epic-summary}

   **Status:** {emoji} {status} | **Owner:** {assignee}

   ## 🎯 Progress Overview
   {progress-bar} {percentage}%
   ✅ {done}/{total} tasks complete

   ## {status-section}
   [List tasks by status with assignees and priorities]

   ## 📈 Next Steps
   [Actionable recommendations based on current state]
   ```

   ### Markdown Format:
   Use clean tables with links to Jira issues

   ### Detail Levels:
   - **Compact**: Show only critical info, blockers, and top priorities
   - **Detailed**: Show all tasks grouped by status
   - **Executive**: High-level summary with risks and timeline

6. **Return** the formatted status update to the user

7. **Optional: Post to Slack**

   After showing the status update, ask the user if they want to post it to Slack using AskUserQuestion:

   ```
   AskUserQuestion({
     questions: [{
       question: "Would you like to post this status update to Slack?",
       header: "Slack Post",
       multiSelect: false,
       options: [
         {
           label: "Yes, post to Slack (Recommended)",
           description: "Share this update with your team in a Slack channel"
         },
         {
           label: "No, just show it here",
           description: "Keep the update in this chat only"
         }
       ]
     }]
   })
   ```

   If user selects "Yes":

   a. **Derive team from epic key**:
      - Extract prefix from epic key (e.g., TAK from TAK-1475)
      - Load webhook configuration from `webhook-config.json` in plugin directory
      - Look up webhook URL for this team prefix

   b. **Check webhook configuration**:
      - If webhook URL exists for this team → use it directly
      - If no webhook configured → inform user and provide setup instructions:
        ```
        No Slack webhook configured for team {prefix}.

        To set up:
        1. Go to https://leanix.slack.com/apps/manage
        2. Search for "Incoming Webhooks"
        3. Add to your team channel (e.g., #team-takeoff)
        4. Copy the webhook URL
        5. Add it to webhook-config.json in the plugin directory

        Would you like to enter a webhook URL manually for this post?
        ```

   c. **Post via Slack Bot Token** (using Bash curl with Slack API):
      ```bash
      # Use TAKEOFF_SLACK_BOT_TOKEN from environment
      curl -X POST "https://slack.com/api/chat.postMessage" \
        -H "Authorization: Bearer ${TAKEOFF_SLACK_BOT_TOKEN}" \
        -H "Content-Type: application/json" \
        -d "{
          \"channel\": \"${channelName}\",
          \"text\": \"${formattedStatusUpdate}\",
          \"unfurl_links\": false,
          \"unfurl_media\": false
        }"
      ```

      Note: channelName can be either:
      - Channel ID (e.g., "C1234567890")
      - Channel name (e.g., "team-takeoff-internal")

   d. **Confirm** successful posting:
      - "✅ Posted to Slack channel {channelName}!"
      - Show which team/channel it was posted to

   **Note:** This uses Slack Incoming Webhooks (simple, no OAuth required).
   Future enhancement: Migrate to Slack MCP with OAuth when it becomes stable.

## Output Formats

### Slack (default)
- Emoji-rich formatting optimized for Slack
- Progress bars with visual indicators
- Color-coded status sections
- Compact, scannable layout

### Markdown
- Clean tables for documentation
- Professional formatting
- Suitable for Confluence or GitHub

## Detail Levels

### Compact (default)
- High-level overview with key metrics
- Focus on blockers and critical items
- Recommended for daily standups

### Detailed
- Complete task breakdown by status
- Individual assignees for each task
- Recommended for weekly reports

### Executive
- Strategic overview focusing on risks
- Minimal task-level detail
- Recommended for leadership updates

## Requirements

- The **leanix-atlassian** MCP server must be connected
- User must have access to leanix.atlassian.net
- Epic key must be valid and accessible
