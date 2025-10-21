.PHONY: help
.DEFAULT_GOAL := help

# initialise .env file for all targets if it exists
-include .env

help: ## Show this help.
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# Document each target that should appear in help using a comment placed after the target's colon, starting with '##' (as shown above).
# Targets without such a comment will not appear in the help output.

run-inspector: ## Run the MCP inspector.
	@npx @modelcontextprotocol/inspector -e DISCORD_TOKEN=$(DISCORD_TOKEN)
