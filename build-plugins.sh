#!/usr/bin/env bash
set -euo pipefail

# Build all plugins in the marketplace
# Usage: ./build-plugins.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGINS_DIR="$SCRIPT_DIR/plugins"

echo "🔨 Building all plugins in the marketplace..."
echo ""

# Find all plugin directories (direct subdirs of shared/ and team-*/)
for category_dir in "$PLUGINS_DIR"/*/; do
    category_name=$(basename "$category_dir")

    # Skip if not a directory or if it's node_modules
    [[ ! -d "$category_dir" ]] && continue
    [[ "$category_name" == "node_modules" ]] && continue

    for plugin_dir in "$category_dir"*/; do
        # Skip if not a directory
        [[ ! -d "$plugin_dir" ]] && continue

        plugin_name=$(basename "$plugin_dir")

        # Skip node_modules
        [[ "$plugin_name" == "node_modules" ]] && continue

        # Check if it has package.json and tsconfig.json
        if [[ ! -f "$plugin_dir/package.json" ]]; then
            continue
        fi

        if [[ ! -f "$plugin_dir/tsconfig.json" ]]; then
            echo "⏭️  Skipping $category_name/$plugin_name (no TypeScript config)"
            continue
        fi

        echo "📦 Building $category_name/$plugin_name..."
        (
            cd "$plugin_dir"

            # Install dependencies if node_modules doesn't exist
            if [[ ! -d "node_modules" ]]; then
                echo "   Installing dependencies..."
                npm install --silent
            fi

            # Build
            echo "   Compiling TypeScript..."
            npm run build --silent

            echo "   ✅ Built successfully"
        )
        echo ""
    done
done

echo "🎉 All plugins built successfully!"