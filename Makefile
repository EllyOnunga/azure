# Azure Bay Restaurant - Build Commands
# Requires Node.js and npm to be installed

# Default target
.PHONY: help
help:
	@echo "Azure Bay Restaurant - Build Commands"
	@echo ""
	@echo "Available targets:"
	@echo "  install     - Install Node.js dependencies"
	@echo "  format      - Format all HTML, CSS, JS files with Prettier"
	@echo "  format:check - Check formatting without modifying files"
	@echo "  lint        - Lint all HTML files with HTMLHint"
	@echo "  lint:fix    - Fix linting issues automatically"
	@echo "  build       - Run full build (lint + format check)"
	@echo "  clean       - Remove node_modules directory"
	@echo ""
	@echo "Prerequisites:"
	@echo "  - Node.js v18 or higher"
	@echo "  - npm v9 or higher"

# Install dependencies
.PHONY: install
install:
	npm install

# Format all code
.PHONY: format
format:
	npm run format

# Check formatting
.PHONY: format:check
format:check:
	npm run format:check

# Lint HTML files
.PHONY: lint
lint:
	npm run lint

# Fix linting issues
.PHONY: lint:fix
lint:fix:
	npm run lint:fix

# Full build
.PHONY: build
build:
	npm run build

# Clean node_modules
.PHONY: clean
clean:
	rm -rf node_modules

# Development server (requires Python or other tools)
.PHONY: serve
serve:
	@echo "Starting development server..."
	@echo "Option 1: Use VS Code Live Server extension"
	@echo "Option 2: Run 'npx serve .' in the project directory"
	@echo "Option 3: Run 'python -m http.server 8000' in the project directory"
