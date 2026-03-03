# Claude Code Plugins Marketplace

> Team marketplace for Claude Code plugins using git submodules

## 🚀 Quick Start

```bash
# Clone marketplace
git clone --recurse-submodules https://github.com/jeb-leanix/claude-plugins-marketplace.git
cd claude-plugins-marketplace

# Install CLI
./cli/install.sh

# List available plugins
claude-plugin list

# Install a plugin
claude-plugin install <plugin-name>

# Create new plugin from template
claude-plugin create my-new-plugin
```

## 📦 Plugin Structure

```
claude-plugins-marketplace/
├── registry.json           # Plugin catalog
├── plugins/
│   ├── shared/            # Shared plugins (all teams)
│   └── team-takeoff/      # Team-specific plugins
├── cli/
│   └── claude-plugin      # CLI tool
└── templates/
    └── plugin-template/   # Template for new plugins (submodule)
```

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
