#compdef claude-plugin
# Zsh completion for claude-plugin CLI

_claude_plugin() {
    local -a commands
    commands=(
        'list:List available plugins'
        'install:Install a plugin'
        'uninstall:Uninstall a plugin'
        'update:Update plugin(s)'
        'create:Create new plugin from template'
        'docs:Show plugin documentation'
        'info:Show plugin details'
        'help:Show help message'
    )

    local -a list_opts
    list_opts=(
        '--team=[Filter by team]:team:(team-takeoff shared)'
        '--shared[Show only shared plugins]'
    )

    _arguments -C \
        '1: :->command' \
        '*:: :->args'

    case $state in
        command)
            _describe 'command' commands
            ;;
        args)
            case $words[1] in
                list)
                    _arguments $list_opts
                    ;;
                install|uninstall|update|docs|info)
                    # Get plugin IDs from registry
                    local -a plugins
                    local registry_file=""

                    # Try to find registry.json
                    if [[ -f "registry.json" ]]; then
                        registry_file="registry.json"
                    else
                        local marketplace_dir=$(find ~ -name "claude-plugins-marketplace" -type d 2>/dev/null | head -1)
                        if [[ -n "$marketplace_dir" && -f "$marketplace_dir/registry.json" ]]; then
                            registry_file="$marketplace_dir/registry.json"
                        fi
                    fi

                    if [[ -n "$registry_file" ]]; then
                        plugins=(${(f)"$(jq -r '.plugins[] | "\(.id):\(.description)"' "$registry_file" 2>/dev/null)"})
                        _describe 'plugin' plugins
                    fi
                    ;;
                create)
                    _message 'plugin name'
                    ;;
                help)
                    _describe 'command' commands
                    ;;
            esac
            ;;
    esac
}

_claude_plugin "$@"