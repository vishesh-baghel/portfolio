#!/bin/bash

# Test MCP Server Connection
# This script verifies that the vishesh-experiments MCP server works correctly

set -e

echo "🔍 Testing vishesh-experiments MCP Server"
echo "=========================================="
echo ""

# Check npm registry version
echo "1️⃣  Checking published version..."
PUBLISHED_VERSION=$(npm view vishesh-experiments version 2>/dev/null || echo "NOT FOUND")
echo "   Published version: $PUBLISHED_VERSION"
echo ""

# Test MCP protocol handshake
echo "2️⃣  Testing MCP protocol handshake..."
RESPONSE=$(echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | npx -y vishesh-experiments@latest 2>/dev/null)

if [ -z "$RESPONSE" ]; then
    echo "   ❌ FAILED: No response from server"
    echo ""
    echo "   Debugging info:"
    echo "   Running with stderr output:"
    echo '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0.0"}}}' | npx -y vishesh-experiments@latest
    exit 1
fi

# Parse response
SERVER_NAME=$(echo "$RESPONSE" | grep -o '"name":"[^"]*"' | cut -d'"' -f4)
SERVER_VERSION=$(echo "$RESPONSE" | grep -o '"version":"[^"]*"' | cut -d'"' -f4)

if [ -z "$SERVER_NAME" ]; then
    echo "   ❌ FAILED: Invalid response (not valid JSON-RPC)"
    echo "   Response: $RESPONSE"
    exit 1
fi

echo "   ✅ SUCCESS: Server responded correctly"
echo "   Server: $SERVER_NAME v$SERVER_VERSION"
echo ""

# Test list tools
echo "3️⃣  Testing tools list..."
TOOLS_RESPONSE=$(echo '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' | npx -y vishesh-experiments@latest 2>/dev/null)

if echo "$TOOLS_RESPONSE" | grep -q "listExperiments"; then
    echo "   ✅ SUCCESS: Tools are available"
    TOOL_COUNT=$(echo "$TOOLS_RESPONSE" | grep -o '"name"' | wc -l)
    echo "   Found $TOOL_COUNT tools"
else
    echo "   ⚠️  WARNING: Could not verify tools"
fi
echo ""

# Check npx cache
echo "4️⃣  Checking npx cache..."
NPX_CACHE_DIR="$HOME/.npm/_npx"
if [ -d "$NPX_CACHE_DIR" ]; then
    CACHE_SIZE=$(du -sh "$NPX_CACHE_DIR" 2>/dev/null | cut -f1)
    echo "   npx cache exists: $CACHE_SIZE"
    
    if find "$NPX_CACHE_DIR" -name "vishesh-experiments" -type d 2>/dev/null | grep -q .; then
        echo "   ⚠️  vishesh-experiments is cached"
        echo "   To clear: rm -rf $NPX_CACHE_DIR/*/node_modules/vishesh-experiments"
    fi
else
    echo "   No npx cache found"
fi
echo ""

# Summary
echo "=========================================="
echo "📊 Summary"
echo "=========================================="
echo "Published Version: $PUBLISHED_VERSION"
echo "Running Version:   $SERVER_VERSION"
echo "MCP Protocol:      ✅ Working"
echo ""

if [ "$PUBLISHED_VERSION" != "$SERVER_VERSION" ]; then
    echo "⚠️  WARNING: Version mismatch!"
    echo "   You may need to clear npx cache and restart Windsurf"
    echo ""
fi

echo "✅ MCP server is working correctly!"
echo ""
echo "If Windsurf still shows yellow status:"
echo "1. Clear npx cache: rm -rf ~/.npm/_npx"
echo "2. Quit Windsurf completely (pkill -9 windsurf)"
echo "3. Restart Windsurf"
echo "4. Check Windsurf logs in ~/.config/Windsurf/logs/"
echo ""
echo "For more help, see WINDSURF_TROUBLESHOOTING.md"
