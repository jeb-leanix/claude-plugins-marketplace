# Quick Installation Guide

Get the Jira Status Update command running in 5 minutes.

## Step 1: Clone Plugin

```bash
mkdir -p ~/.claude/local-plugins
cd ~/.claude/local-plugins
git clone <this-repo-url> jira-status-update
cd jira-status-update
```

## Step 2: Install & Build

```bash
npm install
npm run build
```

## Step 3: Configure Claude

Edit `~/.claude/settings.json`:

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

**Replace** `/Users/YOUR_USERNAME/` with your home directory.

## Step 4: Add Slack Token (Optional)

For Slack posting, add to `~/.claude/settings.json`:

```json
{
  "env": {
    "TAKEOFF_SLACK_BOT_TOKEN": "xoxb-YOUR-TOKEN"
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

### Getting Slack Token

1. https://api.slack.com/apps → Create/Select App
2. **OAuth & Permissions** → Add scopes:
   - `chat:write`
   - `channels:read`
3. Install to workspace
4. Copy **Bot User OAuth Token** (xoxb-...)
5. Invite bot to channels: `/invite @BotName`

## Step 5: Test

```bash
# Restart Claude Code
claude code

# In Claude:
/status-update TAK-1256
```

## Troubleshooting

### Command not found
```bash
# Verify path in settings.json
ls -la ~/.claude/local-plugins/jira-status-update

# Restart Claude Code
```

### Build fails
```bash
cd ~/.claude/local-plugins/jira-status-update
rm -rf node_modules
npm install
npm run build
```

### Slack posting fails
- Check `TAKEOFF_SLACK_BOT_TOKEN` in settings.json
- Verify bot invited to channel: `/invite @BotName`
- Check bot has `chat:write` permission

---

📖 Full documentation: [README.md](README.md)