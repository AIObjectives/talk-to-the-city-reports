#!/bin/sh

. src/lib/scripts/colors.sh

echo "${LIGHT_BLUE}Setting up git hooks...${NC}\n"

git config core.hooksPath turbo/src/lib/scripts/git-hooks

echo "done\n"

echo "${YELLOW}Preparing styles...${NC}"

npm run prepare

echo "\n${LIGHT_GREEN}Starting dev server...${NC}"

vite dev