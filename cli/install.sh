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

# Install completions
SHELL_NAME=$(basename "$SHELL")
COMPLETION_INSTALLED=false

if [[ "$SHELL_NAME" == "zsh" ]]; then
    # Install Zsh completion
    ZSH_COMPLETION_DIR="${ZSH_COMPLETION_DIR:-$HOME/.zsh/completions}"
    mkdir -p "$ZSH_COMPLETION_DIR"
    ln -sf "$SCRIPT_DIR/completions/claude-plugin-completion.zsh" "$ZSH_COMPLETION_DIR/_claude-plugin"
    echo "✓ Installed Zsh completion to $ZSH_COMPLETION_DIR"
    echo "  Add to ~/.zshrc if not present:"
    echo "    fpath=($ZSH_COMPLETION_DIR \$fpath)"
    echo "    autoload -Uz compinit && compinit"
    COMPLETION_INSTALLED=true
elif [[ "$SHELL_NAME" == "bash" ]]; then
    # Install Bash completion
    BASH_COMPLETION_DIR="${BASH_COMPLETION_USER_DIR:-$HOME/.bash_completion.d}"
    mkdir -p "$BASH_COMPLETION_DIR"
    ln -sf "$SCRIPT_DIR/completions/claude-plugin-completion.bash" "$BASH_COMPLETION_DIR/claude-plugin"
    echo "✓ Installed Bash completion to $BASH_COMPLETION_DIR"
    echo "  Add to ~/.bashrc if not present:"
    echo "    for f in ~/.bash_completion.d/*; do source \$f; done"
    COMPLETION_INSTALLED=true
fi

if [[ "$COMPLETION_INSTALLED" == "true" ]]; then
    echo
    echo "  Restart your shell or run: exec $SHELL"
fi

echo
echo "Usage: claude-plugin help"
echo
