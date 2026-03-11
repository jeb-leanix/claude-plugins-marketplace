#!/usr/bin/env bash
# Wrapper script to execute the jira-status-update skill

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PLUGIN_ROOT="$(dirname "$SCRIPT_DIR")"

# Parse arguments
EPIC_KEY=""
FORMAT="slack"
DETAIL="compact"

while [[ $# -gt 0 ]]; do
  case $1 in
    --format=*)
      FORMAT="${1#*=}"
      shift
      ;;
    --detail=*)
      DETAIL="${1#*=}"
      shift
      ;;
    --help)
      echo "Usage: status-update <EPIC-KEY> [--format=slack|markdown] [--detail=compact|detailed|executive]"
      exit 0
      ;;
    *)
      if [[ -z "$EPIC_KEY" ]]; then
        EPIC_KEY="$1"
      fi
      shift
      ;;
  esac
done

if [[ -z "$EPIC_KEY" ]]; then
  echo "Error: EPIC-KEY is required"
  echo "Usage: status-update <EPIC-KEY> [--format=slack|markdown] [--detail=compact|detailed|executive]"
  exit 1
fi

# Execute via node
cd "$PLUGIN_ROOT"
node -e "
import { execute } from './build/index.js';

// This will be called by Claude with MCP context
console.log('Epic: $EPIC_KEY, Format: $FORMAT, Detail: $DETAIL');
console.log('Note: This script requires Claude Code MCP context to execute.');
console.log('Please use the /status-update command from within Claude Code.');
"
