#!/usr/bin/env bash
set -euo pipefail

# Sync marketplace.json from registry.json
# Usage: ./sync-marketplace.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY_FILE="$SCRIPT_DIR/registry.json"
MARKETPLACE_FILE="$SCRIPT_DIR/.claude-plugin/marketplace.json"

if [[ ! -f "$REGISTRY_FILE" ]]; then
    echo "Error: registry.json not found at $REGISTRY_FILE"
    exit 1
fi

echo "Syncing marketplace.json from registry.json..."

# Extract plugins from registry.json and convert to marketplace.json format
jq '{
  name: "leanix-team-marketplace",
  displayName: "LeanIX Team Marketplace",
  version: "1.0.0",
  description: "Team marketplace for LeanIX Claude Code plugins - shared and team-specific tools",
  homepage: "https://github.com/jeb-leanix/claude-plugins-marketplace",
  owner: {
    name: "LeanIX Teams",
    url: "https://github.com/jeb-leanix"
  },
  plugins: [
    .plugins[] |
    select(.category != "template") |  # Exclude templates
    {
      name: .id,
      source: ("./" + .path),
      description: .description,
      version: .version,
      category: .team,
      author: {
        name: (if .team == "shared" then "LeanIX Shared" else "Team TAKEOFF" end)
      }
    }
  ]
}' "$REGISTRY_FILE" > "$MARKETPLACE_FILE"

echo "✅ marketplace.json updated with $(jq '.plugins | length' "$MARKETPLACE_FILE") plugins"
echo ""
echo "Registered plugins:"
jq -r '.plugins[] | "  - \(.name) (\(.category))"' "$MARKETPLACE_FILE"