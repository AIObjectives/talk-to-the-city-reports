#!/bin/sh
. src/lib/scripts/colors.sh

echo "${CYAN}Building nodes...${NC}\n"

./src/lib/scripts/build_nodes.py

echo "${YELLOW}Preparing styles...${NC}"

npm run smui-theme
