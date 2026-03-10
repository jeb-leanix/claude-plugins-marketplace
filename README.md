# Claude Code Plugins Marketplace

[![Build Plugins](https://github.com/jeb-leanix/claude-plugins-marketplace/actions/workflows/build-plugins.yml/badge.svg)](https://github.com/jeb-leanix/claude-plugins-marketplace/actions/workflows/build-plugins.yml)

> Team marketplace for Claude Code plugins using git submodules with automated CI/CD builds

## 🎯 Workflow Overview

1. **Clone** marketplace repo (pre-built branch - no build needed!)
2. **Register** marketplace path in Claude settings
3. **Enable** desired plugins in settings
4. **Use** plugin commands directly (e.g., `/pr-watch`, `/status-update`)

No build step, no install step - plugins are ready to use! 🎉

## 🚀 Quick Start

### Option A: Use Pre-Built Branch (Recommended)

```bash
# 1. Clone the 'built' branch with pre-compiled plugins
git clone -b built --recurse-submodules https://github.com/jeb-leanix/claude-plugins-marketplace.git
cd claude-plugins-marketplace

# That's it! Plugins are ready to use. Continue to step 2.
```

### Option B: Build from Source

```bash
# 1. Clone main branch with submodules
git clone --recurse-submodules https://github.com/jeb-leanix/claude-plugins-marketplace.git
cd claude-plugins-marketplace

# If you already cloned without --recurse-submodules:
git submodule update --init --recursive

# 2. Build all plugins
./build-plugins.sh

# 3. Register marketplace in Claude Code
# Edit ~/.claude/settings.json and add:
```

### 2. Register Marketplace in Claude Code

```bash
# Edit ~/.claude/settings.json and add:
```
```json
{
  "extraKnownMarketplaces": {
    "leanix-team-marketplace": {
      "source": {
        "source": "directory",
        "path": "/absolute/path/to/claude-plugins-marketplace"
      },
      "autoUpdate": true
    }
  }
}
```

**Important:**
- Replace `/absolute/path/to/claude-plugins-marketplace` with your actual path!
- Path MUST point to the **repo root** (NOT `plugins/` subdirectory!)
- **Plugins are enabled directly in settings** - no separate install step needed
- After adding new plugins or updating submodules, run `./build-plugins.sh` to rebuild

```bash
# 4. Reload plugins in Claude Code
/reload-plugins

# 5. Verify plugins are available
/plugin
# You should see: pr-notifier@leanix-team-marketplace, jira-status-update@leanix-team-marketplace, etc.

# 6. Use plugin commands
/pr-watch TAK-1234
/status-update TAK-1475
```

### 🔄 Updating Plugins

**If using pre-built branch:**
```bash
cd claude-plugins-marketplace
git pull origin built
/reload-plugins  # In Claude Code
```

**If building from source:**
```bash
cd claude-plugins-marketplace
git pull origin main
git submodule update --remote
./build-plugins.sh
/reload-plugins  # In Claude Code
```

## 🔧 How It Works

### Automated CI/CD Pipeline

1. **Developer pushes** to `main` branch
2. **GitHub Actions** automatically:
   - Checks out repo with all submodules
   - Runs `./build-plugins.sh`
   - Commits built artifacts to `built` branch
3. **Users clone** the `built` branch → get pre-compiled plugins
4. **No manual build needed!**

### For Contributors

- **Main branch**: Source code, no build artifacts
- **Built branch**: Auto-generated, includes `build/` and `node_modules/`
- **Never commit** build artifacts to `main`
- **CI handles** all builds automatically

## 📦 Plugin Structure

```
claude-plugins-marketplace/
├── .claude-plugin/
│   └── marketplace.json         # Claude Code marketplace definition (auto-generated)
├── registry.json                # Plugin catalog (source of truth)
├── sync-marketplace.sh          # Sync marketplace.json from registry.json
├── build-plugins.sh             # Build all TypeScript plugins
├── plugins/
│   ├── shared/                  # Shared plugins (all teams)
│   │   └── pr-notifier/         # Git submodule
│   └── team-takeoff/            # Team-specific plugins
│       └── jira-status-update/  # Git submodule
└── templates/
    └── plugin-template/         # Template for new plugins (submodule)
```

**Plugin Management:**
- `registry.json` = Source of truth for plugin metadata
- `.claude-plugin/marketplace.json` = Auto-generated (run `./sync-marketplace.sh`)
- Plugins as **git submodules** = Each plugin is a separate repo
- **TypeScript plugins require build** = Run `./build-plugins.sh` after clone/update

## 🎯 Usage

### List Plugins

```bash
# All plugins
claude-plugin list

# Team-specific
claude-plugin list --team=takeoff

# Only shared plugins
claude-plugin list --shared
```

### Install Plugin

```bash
# Install plugin to ~/.claude/plugins/local/
claude-plugin install deployment-helper

# Install specific version
claude-plugin install deployment-helper@1.2.0
```

### Create New Plugin

```bash
# Create from template
claude-plugin create my-plugin

# Creates plugins/team-takeoff/my-plugin/
# Automatically adds to registry.json
```

### Update Plugin

```bash
# Update to latest version
claude-plugin update deployment-helper

# Update all installed plugins
claude-plugin update --all
```

## 🏗️ Plugin Development

### 1. Create Plugin from Template

```bash
claude-plugin create my-awesome-plugin
cd plugins/team-takeoff/my-awesome-plugin
```

### 2. Develop Your Plugin

Edit `plugin.json`:
```json
{
  "name": "my-awesome-plugin",
  "version": "1.0.0",
  "description": "Does awesome things",
  "skills": ["skill1"]
}
```

Add skills in `skills/` directory.

### 3. Register Plugin

The `create` command automatically adds entry to `registry.json`:

```json
{
  "id": "my-awesome-plugin",
  "name": "My Awesome Plugin",
  "team": "team-takeoff",
  "visibility": "team-only",
  "path": "plugins/team-takeoff/my-awesome-plugin"
}
```

**IMPORTANT:** After adding to `registry.json`, run:
```bash
./sync-marketplace.sh  # Updates .claude-plugin/marketplace.json
```

### 4. Submit PR

```bash
git add .
git commit -m "Add my-awesome-plugin"
git push
# Create PR on GitHub
```

## 📋 Plugin Categories

- **shared/** - General-purpose plugins for all teams
- **team-takeoff/** - Import/Export deployment tools
- **team-flow/** - Team Flow specific tools
- **team-xyz/** - Add more teams as needed

## 🔒 Visibility

- **public** - Available to everyone
- **team-only** - Only visible/installable by team members
- **private** - Requires explicit access

## 🛠️ CLI Installation

```bash
# From marketplace repo
./cli/install.sh

# Or manually
ln -s $(pwd)/cli/claude-plugin /usr/local/bin/claude-plugin
```

## 📚 Plugin Template

See [plugin-template](templates/plugin-template/) for structure and best practices.

## 🤝 Contributing

1. Create plugin from template
2. Develop and test locally
3. Add to registry.json
4. Submit PR
5. Team reviews and merges

## 📖 Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Plugin Development Guide](https://docs.anthropic.com/claude-code/plugins)

## 🎯 Examples

Check out existing plugins:
- `plugins/shared/git-tools/` - Git workflow helpers
- `plugins/team-takeoff/deployment-helper/` - Deployment automation

---

**Maintained by LeanIX Teams** | [Report Issues](https://github.com/jeb-leanix/claude-plugins-marketplace/issues)
