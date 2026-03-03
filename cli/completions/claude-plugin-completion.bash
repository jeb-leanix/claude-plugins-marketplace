#!/usr/bin/env bash
# Bash completion for claude-plugin CLI

_claude_plugin_completion() {
    local cur prev opts cmds
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # Top-level commands
    cmds="list install uninstall update create docs info help"

    # Handle completion based on command
    if [[ ${COMP_CWORD} -eq 1 ]]; then
        # Complete commands
        COMPREPLY=( $(compgen -W "${cmds}" -- ${cur}) )
        return 0
    fi

    local cmd="${COMP_WORDS[1]}"

    case "${cmd}" in
        list)
            # list [--team=<team>] [--shared]
            opts="--team= --shared"
            if [[ ${cur} == --team=* ]]; then
                local teams="team-takeoff shared"
                local prefix="${cur%%=*}="
                COMPREPLY=( $(compgen -W "${teams}" -P "${prefix}" -- "${cur#*=}") )
            else
                COMPREPLY=( $(compgen -W "${opts}" -- ${cur}) )
            fi
            ;;
        install|uninstall|update|docs|info)
            # Complete plugin IDs from registry
            if [[ -f "$HOME/.claude/projects/-Users-I529075-dev-import-export/memory/../../../plugins-marketplace/registry.json" ]] || [[ -f "registry.json" ]]; then
                local registry_file=""
                if [[ -f "registry.json" ]]; then
                    registry_file="registry.json"
                else
                    # Try to find marketplace directory
                    local marketplace_dir=$(find ~ -name "claude-plugins-marketplace" -type d 2>/dev/null | head -1)
                    if [[ -n "$marketplace_dir" && -f "$marketplace_dir/registry.json" ]]; then
                        registry_file="$marketplace_dir/registry.json"
                    fi
                fi

                if [[ -n "$registry_file" ]]; then
                    local plugins=$(jq -r '.plugins[].id' "$registry_file" 2>/dev/null)
                    COMPREPLY=( $(compgen -W "${plugins}" -- ${cur}) )
                fi
            fi
            ;;
        create)
            # No completion needed for create (free text)
            ;;
        help)
            # Complete commands for detailed help
            COMPREPLY=( $(compgen -W "${cmds}" -- ${cur}) )
            ;;
    esac

    return 0
}

complete -F _claude_plugin_completion claude-plugin