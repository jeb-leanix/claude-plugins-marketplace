# Jira Status Update Command

Generate comprehensive status updates for Jira Epics with interactive Slack posting for LeanIX Team Takeoff.

## Features

- 📊 Automatic epic analysis with progress tracking
- 🔍 Blocker detection and risk identification
- 📝 Multiple output formats (Slack, Markdown)
- 📈 Detail levels (Compact, Detailed, Executive)
- 💬 Interactive Slack posting with preview & confirmation
- 🤖 Fully integrated with Claude Code

## Prerequisites

- **Claude Code** CLI installed
- **leanix-atlassian MCP server** connected (for Jira access)
- **Slack Bot Token** with `chat:write` permission (for Slack posting)

## Installation

### 1. Clone or Copy the Plugin

```bash
# Create local plugins directory if it doesn't exist
mkdir -p ~/.claude/local-plugins

# Clone or copy this repo into the directory
cd ~/.claude/local-plugins
git clone <this-repo-url> jira-status-update

# Or if copying manually:
cp -r /path/to/jira-status-update ~/.claude/local-plugins/
```

### 2. Install Dependencies

```bash
cd ~/.claude/local-plugins/jira-status-update
npm install
npm run build
```

### 3. Configure Local Marketplace

Add the local marketplace to your Claude Code settings:

```bash
# Edit ~/.claude/settings.json
```

Add this configuration:

```json
{
  "enabledPlugins": {
    "jira-status-update@local": true
  },
  "extraKnownMarketplaces": {
    "local": {
      "source": {
        "source": "directory",
        "path": "/Users/YOUR_USERNAME/.claude/local-plugins"
      }
    }
  }
}
```

**Important:** Replace `/Users/YOUR_USERNAME/` with your actual home directory path.

### 4. Configure Slack Bot Token (Optional for Slack Posting)

To enable Slack posting, add your Slack Bot Token to the settings:

```json
{
  "env": {
    "TAKEOFF_SLACK_BOT_TOKEN": "xoxb-YOUR-BOT-TOKEN-HERE"
  },
  "enabledPlugins": {
    "jira-status-update@local": true
  },
  "extraKnownMarketplaces": {
    "local": {
      "source": {
        "source": "directory",
        "path": "/Users/YOUR_USERNAME/.claude/local-plugins"
      }
    }
  }
}
```

#### Getting a Slack Bot Token

1. Go to https://api.slack.com/apps
2. Create a new app or select existing one
3. Navigate to **OAuth & Permissions**
4. Add these Bot Token Scopes:
   - `chat:write` (to post messages)
   - `channels:read` (to list channels)
5. Install the app to your workspace
6. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
7. Invite the bot to your channels: `/invite @YourBotName` in each channel

### 5. Verify Installation

Restart Claude Code and verify the command is available:

```bash
claude code
# In Claude: type "/status-update --help"
```

## Usage

### Interactive Mode (Recommended)

Simply call the command with an epic key:

```bash
/status-update TAK-1256
```

Claude will:
1. Show you the formatted status update
2. Ask: "Do you want to post this to Slack?"
3. If yes, ask which channel: `#team-takeoff-internal` or `#team-takeoff-status`
4. Show preview and ask for final confirmation
5. Post to Slack if confirmed

### Manual Mode

Specify all options upfront:

```bash
# Just show the status update
/status-update TAK-1256

# Show with different format/detail
/status-update TAK-1256 --format=markdown --detail=executive

# Post to Slack (will still ask for confirmation)
/status-update TAK-1256 --post --channel=#team-takeoff-internal
```

## Command Options

```
/status-update <EPIC-KEY> [options]

Options:
  --format=<slack|markdown>              Output format (default: slack)
  --detail=<compact|detailed|executive>  Detail level (default: compact)
  --post                                 Post to Slack (requires --channel)
  --channel=<#channel-name|ID>           Slack channel to post to
  --confirmed                            Skip confirmation (internal use only)
  --slack-token=<token>                  Override token (uses env var by default)
```

## Output Formats

### Slack Format (default)
- Emoji-rich formatting optimized for Slack
- Progress bars with visual indicators
- Color-coded status sections
- Compact and easy to scan

### Markdown Format
- Clean tables and formatting
- Professional appearance
- Suitable for Confluence/GitHub documentation

## Detail Levels

### Compact (default)
- High-level overview
- Key metrics and blockers
- Top priority items
- Perfect for daily standups

### Detailed
- Full task breakdown by status
- Individual assignees
- Complete issue lists
- Best for weekly team reports

### Executive
- Strategic overview
- Focus on risks and timeline
- Minimal task detail
- Ideal for leadership updates

## Available Channels

Currently configured channels for Slack posting:
- `#team-takeoff-internal` - Internal team discussions
- `#team-takeoff-status` - Status reports and updates

To add more channels, invite your Slack bot to the channel and use the channel name or ID.

## Examples

```bash
# Basic status update (shows + asks about Slack posting)
/status-update TAK-1256

# Markdown format for documentation
/status-update TAK-1256 --format=markdown

# Executive summary
/status-update TAK-1256 --detail=executive

# Direct to Slack (with confirmation)
/status-update TAK-1256 --post --channel=#team-takeoff-status
```

## File Structure

```
jira-status-update/
├── .claude-plugin/
│   └── plugin.json          # Plugin metadata for Claude
├── src/
│   ├── index.ts             # Main command logic
│   ├── analyzer.ts          # Epic analysis engine
│   ├── slack-poster.ts      # Slack API integration
│   ├── types.ts             # TypeScript types
│   └── formatters/
│       ├── slack.ts         # Slack output formatter
│       └── markdown.ts      # Markdown output formatter
├── skills/
│   └── status-update/
│       └── skill.md         # Instructions for Claude
├── build/                   # Compiled JavaScript (generated)
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript config
└── README.md                # This file
```

## Development

### Make Changes

```bash
cd ~/.claude/local-plugins/jira-status-update

# Edit TypeScript files in src/
vim src/index.ts

# Rebuild
npm run build

# Test in Claude Code
claude code
```

### Update Documentation

- User-facing docs: Edit `README.md`
- Claude behavior: Edit `skills/status-update/skill.md`

## Troubleshooting

### Command not found
- Verify plugin is in `~/.claude/local-plugins/jira-status-update/`
- Check `~/.claude/settings.json` has correct configuration
- Restart Claude Code

### Slack posting fails
- Verify `TAKEOFF_SLACK_BOT_TOKEN` is set in `~/.claude/settings.json`
- Check bot has `chat:write` permission
- Ensure bot is invited to target channel: `/invite @BotName`

### Epic not found
- Verify you have access to the Jira workspace via leanix-atlassian MCP
- Check epic key is correct (e.g., `TAK-1256`)

### Build errors
```bash
cd ~/.claude/local-plugins/jira-status-update
rm -rf node_modules
npm install
npm run build
```

## Architecture

### How it Works

1. **Command Invocation**: User calls `/status-update TAK-1256`
2. **Data Fetching**: Command uses leanix-atlassian MCP to fetch epic and subtasks from Jira
3. **Analysis**: Analyzer calculates progress, identifies blockers, and extracts insights
4. **Formatting**: Appropriate formatter generates output (Slack or Markdown)
5. **Interactive Flow**:
   - If `--post` flag without `--confirmed`: Returns preview JSON
   - Claude reads preview, shows to user, asks for confirmation
   - If confirmed: Command called again with `--confirmed` flag
   - Slack API called to post message

### Security

- Bot token stored in Claude settings (not in git)
- Preview-before-post prevents accidental messages
- No destructive operations

## Contributing

To improve this plugin:

1. Make changes in your local copy
2. Test thoroughly with `npm run build`
3. Commit and push to your repository
4. Share with team

## Support

For issues or questions:
- Team Takeoff: Reach out to Jens Beau
- General: Create issue in repository

## License

Internal tool for LeanIX Team Takeoff

---

🤖 Built with Claude Code | 📊 Powered by leanix-atlassian MCP