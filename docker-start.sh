#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🐳 Rhythmeo Docker Launcher${NC}\n"

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}Error: .env file not found!${NC}"
    echo "Please copy .env.example to .env and configure it."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Menu
echo "Select environment:"
echo "1) Development (with hot-reload)"
echo "2) Production"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo -e "\n${GREEN}Starting development environment...${NC}"
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    2)
        echo -e "\n${GREEN}Starting production environment...${NC}"
        docker-compose up --build
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac
