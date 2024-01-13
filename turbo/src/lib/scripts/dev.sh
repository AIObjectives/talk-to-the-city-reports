#!/bin/sh
. src/lib/scripts/colors.sh

./src/lib/scripts/prepare.sh

echo "${LIGHT_BLUE}Setting up git hooks...${NC}\n"

git config core.hooksPath turbo/src/lib/scripts/git-hooks

echo "\n${LIGHT_GREEN}Starting dev server...${NC}"

vite dev