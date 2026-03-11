# Claude Code Plugin Template

> Template for creating new Claude Code plugins

## 🚀 Quick Start

### Using the Marketplace CLI

```bash
# From the marketplace repo
claude-plugin create my-awesome-plugin
```

### Manual Setup

```bash
# Clone this template
git clone https://github.com/jeb-leanix/claude-plugin-template.git my-plugin
cd my-plugin

# Update plugin.json
vim plugin.json

# Create your skills
mkdir skills/my-skill
vim skills/my-skill/skill.json
```

## 📁 Plugin Structure

```
my-plugin/
├── plugin.json              # Plugin metadata
├── README.md                # Plugin documentation
├── CHANGELOG.md             # Version history
└── skills/                  # Skills directory
    └── my-skill/
        ├── skill.json       # Skill configuration
        └── assets/          # Optional: skill assets (images, files)
            └── example.txt
```

## 📋 plugin.json

The main plugin configuration file:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "What this plugin does",
  "author": "Your Name",
  "homepage": "https://github.com/your-org/my-plugin",
  "skills": [
    "my-skill"
  ],
  "settings": {
    "api-key": {
      "type": "string",
      "description": "API key for external service",
      "default": "",
      "required": false
    }
  }
}
```

### Fields

- **name**: Plugin identifier (lowercase, hyphens)
- **version**: Semantic version (1.0.0)
- **description**: Short description of plugin functionality
- **author**: Your name or team name
- **homepage**: URL to plugin repository or documentation
- **skills**: Array of skill directory names
- **settings**: Optional plugin-level settings

## 🎯 Skills

Skills are the core functionality of your plugin. Each skill lives in `skills/<skill-name>/`.

### skill.json

```json
{
  "name": "my-skill",
  "description": "Brief description of what this skill does",
  "instructions": [
    {
      "type": "text",
      "text": "Detailed instructions for Claude on when and how to use this skill.\n\n## When to Use\n\n- Condition 1\n- Condition 2\n\n## Examples\n\n```bash\n/my-skill do-something\n```\n\nARGUMENTS: {{args}}"
    }
  ]
}
```

### Instructions Best Practices

1. **Be Specific**: Clearly define when Claude should invoke the skill
2. **Provide Examples**: Show concrete usage examples
3. **Use Templates**: `{{args}}` for dynamic arguments
4. **Structure**: Use headings for organization

## 🛠️ Development Workflow

### 1. Plan Your Plugin

- What problem does it solve?
- What skills does it need?
- What settings are required?

### 2. Create Plugin Structure

```bash
mkdir -p my-plugin/skills/skill1
cd my-plugin
```

### 3. Write plugin.json

Define metadata and list skills.

### 4. Create Skills

For each skill:
1. Create `skills/<skill-name>/skill.json`
2. Write clear instructions
3. Add examples

### 5. Test Locally

```bash
# Link to Claude plugins directory
ln -s $(pwd) ~/.claude/plugins/local/my-plugin

# Test in Claude Code
# Use the skill and verify behavior
```

### 6. Document

- Update README.md with usage instructions
- Add examples
- Document settings

### 7. Version and Release

```bash
# Update version in plugin.json
# Commit changes
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push && git push --tags
```

## 📚 Skill Examples

### Simple Command Skill

```json
{
  "name": "hello",
  "description": "Says hello to the user",
  "instructions": [
    {
      "type": "text",
      "text": "When the user says 'hello' or greets you, use this skill to respond with a friendly greeting.\n\nARGUMENTS: (none)"
    }
  ]
}
```

### Data Processing Skill

```json
{
  "name": "process-data",
  "description": "Processes data files",
  "instructions": [
    {
      "type": "text",
      "text": "Use this skill when the user wants to process a data file.\n\n## Usage\n\n```bash\n/process-data --file=data.csv --format=json\n```\n\n## Arguments\n\n- `--file`: Path to input file\n- `--format`: Output format (json, xml, yaml)\n\nARGUMENTS: {{args}}"
    }
  ]
}
```

## 🔧 Settings

Plugin settings allow configuration without code changes.

### Defining Settings

```json
{
  "settings": {
    "api-url": {
      "type": "string",
      "description": "API endpoint URL",
      "default": "https://api.example.com",
      "required": true
    },
    "timeout": {
      "type": "number",
      "description": "Request timeout in seconds",
      "default": 30
    },
    "debug": {
      "type": "boolean",
      "description": "Enable debug logging",
      "default": false
    }
  }
}
```

### Accessing Settings

Settings are available to Claude during skill execution. Reference them in instructions:

```text
This skill uses the API endpoint configured in settings.api-url
```

## 📖 Advanced Features

### Multi-Skill Plugins

Create multiple related skills:

```
my-plugin/
└── skills/
    ├── deploy/
    │   └── skill.json
    ├── rollback/
    │   └── skill.json
    └── status/
        └── skill.json
```

### Skill Assets

Include files, templates, or data:

```
skills/my-skill/
├── skill.json
└── assets/
    ├── template.yaml
    └── config.json
```

Reference in instructions:
```text
Use the template at skills/my-skill/assets/template.yaml
```

## 🎯 Best Practices

1. **Clear Naming**: Use descriptive, lowercase-hyphenated names
2. **Single Responsibility**: Each skill should do one thing well
3. **Good Documentation**: Clear instructions for when to use the skill
4. **Examples**: Always provide usage examples
5. **Version Properly**: Follow semantic versioning
6. **Test Thoroughly**: Test skills in real scenarios
7. **Keep It Simple**: Start simple, add complexity as needed

## 📋 Checklist for New Plugins

- [ ] Created plugin.json with metadata
- [ ] Defined at least one skill
- [ ] Written clear instructions
- [ ] Added usage examples
- [ ] Tested locally
- [ ] Documented in README.md
- [ ] Added to marketplace registry
- [ ] Tagged release version

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📚 Resources

- [Claude Code Documentation](https://docs.anthropic.com/claude-code)
- [Plugin Development Guide](https://docs.anthropic.com/claude-code/plugins)
- [Marketplace](https://github.com/jeb-leanix/claude-plugins-marketplace)

## 📄 License

MIT License - See LICENSE file for details

---

**Happy Plugin Building!** 🚀
