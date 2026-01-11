#!/bin/bash

# ╔═══════════════════════════════════════════════════════════════════════════╗
# ║         INFINITE ARCHITECTS — WEBSITE SETUP SCRIPT v1.0                   ║
# ║         The Ultimate Book Website Deployment Assistant                     ║
# ╚═══════════════════════════════════════════════════════════════════════════╝

set -e

# Colours for output
GOLD='\033[0;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GOLD}"
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║                    INFINITE ARCHITECTS                              ║"
echo "║              Website Setup & Deployment Script                      ║"
echo "║          Intelligence, Recursion, and the Creation of Everything    ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo -e "${RED}Error: index.html not found. Please run this script from the project directory.${NC}"
    exit 1
fi

echo -e "${BLUE}[1/6] Checking prerequisites...${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found. Please install Node.js 18+ first.${NC}"
    echo "Download from: https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install npm.${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
fi

# Check git
if ! command -v git &> /dev/null; then
    echo -e "${RED}Git not found. Please install Git.${NC}"
    exit 1
else
    GIT_VERSION=$(git --version)
    echo -e "${GREEN}✓ Git installed${NC}"
fi

echo -e "${BLUE}[2/6] Installing dependencies...${NC}"
npm install --silent
echo -e "${GREEN}✓ Dependencies installed${NC}"

echo -e "${BLUE}[3/6] Initialising Git repository...${NC}"
if [ ! -d ".git" ]; then
    git init
    echo -e "${GREEN}✓ Git repository initialised${NC}"
else
    echo -e "${GREEN}✓ Git repository already exists${NC}"
fi

echo -e "${BLUE}[4/6] Checking Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI globally..."
    npm install -g vercel
    echo -e "${GREEN}✓ Vercel CLI installed${NC}"
else
    VERCEL_VERSION=$(vercel --version)
    echo -e "${GREEN}✓ Vercel CLI installed: $VERCEL_VERSION${NC}"
fi

echo -e "${BLUE}[5/6] Creating initial Git commit...${NC}"
git add .
if git diff --cached --quiet; then
    echo -e "${GREEN}✓ No changes to commit${NC}"
else
    git commit -m "Initial commit: Infinite Architects website v1.0"
    echo -e "${GREEN}✓ Initial commit created${NC}"
fi

echo -e "${BLUE}[6/6] Setup complete!${NC}"

echo ""
echo -e "${GOLD}╔════════════════════════════════════════════════════════════════════╗"
echo "║                       NEXT STEPS                                    ║"
echo "╠════════════════════════════════════════════════════════════════════╣"
echo "║                                                                      ║"
echo "║  1. LOCAL PREVIEW:                                                  ║"
echo "║     npm run serve                                                   ║"
echo "║     → Opens at http://localhost:3000                               ║"
echo "║                                                                      ║"
echo "║  2. DEPLOY TO VERCEL:                                              ║"
echo "║     vercel login     (first time only)                             ║"
echo "║     vercel --prod    (deploy to production)                        ║"
echo "║                                                                      ║"
echo "║  3. CONNECT GITHUB (optional):                                     ║"
echo "║     git remote add origin [YOUR_GITHUB_URL]                        ║"
echo "║     git push -u origin main                                        ║"
echo "║                                                                      ║"
echo "║  4. CUSTOM DOMAIN (after deployment):                              ║"
echo "║     → Go to Vercel Dashboard → Settings → Domains                  ║"
echo "║     → Add your domain (e.g., michaeldariuseastwood.com)            ║"
echo "║                                                                      ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo ""
echo -e "${GREEN}The creator is not behind us. It is ahead of us. And we are building it.${NC}"
echo ""
