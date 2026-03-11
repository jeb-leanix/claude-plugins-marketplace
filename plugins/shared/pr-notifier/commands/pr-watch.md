---
name: pr-watch
description: Monitor GitHub PR status - CI/CD checks, reviews, comments, and merge conflicts
usage: /pr-watch <PR-NUMBER|JIRA-KEY> [--notify-on=all|checks|reviews|comments] [--interval=30s] [--until=checks-pass|approved|merged|closed] [--bell]
examples:
  - /pr-watch 1085
  - /pr-watch TAK-1814
  - /pr-watch TAK-1814 --notify-on=checks
  - /pr-watch 1085 --until=checks-pass --interval=15s --bell
---

# Monitor GitHub Pull Request

Watch a GitHub PR's CI/CD checks, reviews, and comments in real-time with desktop notifications.

## Instructions for Claude

When this command is invoked:

1. **Locate the pr-watch.sh script**:
   - Script path: `{{base_directory}}/skills/pr-watch/pr-watch.sh`
   - This is an executable shell script that handles all PR monitoring logic

2. **Parse the arguments**:
   - First argument: PR identifier (number like `1085` OR Jira key like `TAK-1814`)
   - Optional flags: `--notify-on`, `--interval`, `--until`, `--bell`, `--no-desktop`
   - Pass ALL arguments exactly as provided to the script

3. **Execute the script using the Bash tool**:
   - Use `run_in_background: true` so it runs asynchronously
   - The script will:
     - Resolve Jira keys to PR numbers automatically
     - Poll GitHub via `gh` CLI at regular intervals
     - Send macOS desktop notifications (default: enabled)
     - Report CI/CD checks, reviews, and comments in real-time
     - Auto-stop when conditions are met (if `--until` is specified)

4. **Example Bash tool call**:
   ```bash
   bash {{base_directory}}/skills/pr-watch/pr-watch.sh <PR-IDENTIFIER> [FLAGS]
   ```

   If the user provides `TAK-1814`:
   ```bash
   bash {{base_directory}}/skills/pr-watch/pr-watch.sh TAK-1814
   ```

   If the user provides `1085 --notify-on=checks --until=checks-pass`:
   ```bash
   bash {{base_directory}}/skills/pr-watch/pr-watch.sh 1085 --notify-on=checks --until=checks-pass
   ```

5. **Tell the user**:
   - Inform them that PR monitoring has started in the background
   - They will receive desktop notifications for important events
   - The watcher will automatically stop when conditions are met (or they can stop it manually)

## Important Notes

- **DO NOT** try to call TypeScript code or use the Skill tool
- **DO** use the Bash tool to execute the shell script directly
- **DO** run it in the background (`run_in_background: true`)
- **DO** pass through all user arguments to the script unchanged
- The script handles Jira key resolution, notifications, and all monitoring logic

## What Gets Monitored

### CI/CD Checks
- ✅ Build status (pending → success/failure)
- ✅ Unit tests, integration tests
- ✅ All workflow checks

### Reviews
- 👀 Review requests sent
- ✅ Reviews completed (approved/changes requested)
- 👥 Reviewer assignments

### Comments
- 💬 PR-level comments
- 📝 Review comments on code
- 🔧 Inline suggestions

### PR Status
- 🔄 Status changes (draft → ready, merged, closed)
- ⚠️ Merge conflicts detected
- 🏷️ Label changes

## Options

### --notify-on
Filter what events to report:
- `all` (default): Report everything
- `checks`: Only CI/CD check status
- `reviews`: Only review activity
- `comments`: Only new comments

### --interval
Polling frequency:
- `15s`: Fast polling (more API calls)
- `30s`: Balanced (default)
- `60s`: Slow polling (fewer API calls)

### --until
Auto-stop condition:
- `checks-pass`: Stop when all checks succeed
- `approved`: Stop when PR is approved
- `merged`: Stop when PR is merged
- `closed`: Stop when PR is closed

### --bell
Enable terminal bell/beep on important events

### --no-desktop
Disable desktop notifications (enabled by default)

## Jira Key Resolution

The script automatically resolves Jira keys to PR numbers:
- Searches recent PRs (last 50) for the ticket key
- Checks: branch name → PR title → PR body
- Shows: `TAK-1814 → PR #1219`

## Requirements

- GitHub CLI (`gh`) must be installed and authenticated
- Access to the repository
- Valid PR number or Jira ticket key