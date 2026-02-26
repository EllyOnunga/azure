#!/bin/bash

# Azure Bay Restaurant - Setup and Build Script
# Run this script in your WSL Ubuntu terminal

echo "=== Azure Bay Restaurant Setup ==="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed"
    echo "Please install Node.js v18 or higher:"
    echo "  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -"
    echo "  sudo apt-get install -y nodejs"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "Found Node.js version: $NODE_VERSION"

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install

# Run build
echo ""
echo "Running build..."
npm run build

echo ""
echo "=== Setup Complete ==="
