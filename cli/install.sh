#!/usr/bin/env bash
set -euo pipefail

# Install claude-plugin CLI to /usr/local/bin

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI_SOURCE="$SCRIPT_DIR/claude-plugin"
INSTALL_PATH="/usr/local/bin/claude-plugin"

echo "Installing claude-plugin CLI..."

# Check if /usr/local/bin exists
if [[ ! -d "/usr/local/bin" ]]; then
    echo "Creating /usr/local/bin directory..."
    sudo mkdir -p /usr/local/bin
fi

# Create symlink
if [[ -L "$INSTALL_PATH" ]]; then
    echo "Removing existing installation..."
    sudo rm "$INSTALL_PATH"
fi

sudo ln -s "$CLI_SOURCE" "$INSTALL_PATH"

echo "✓ Installed successfully!"
echo
echo "Usage: claude-plugin help"
echo
