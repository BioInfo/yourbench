#!/bin/bash

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Function to cleanup background processes on exit
cleanup() {
    echo "Shutting down services..."
    if [ -n "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    if [ -d "$SCRIPT_DIR/backend" ]; then
        cd "$SCRIPT_DIR/backend" && docker-compose down
    fi
    exit 0
}

# Set up cleanup trap
trap cleanup EXIT INT TERM

# Print colorful status messages
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting YourBench Development Environment${NC}"

# Start backend services
echo -e "\n${GREEN}Starting backend services...${NC}"
cd "$SCRIPT_DIR/backend" || {
    echo -e "${RED}Backend directory not found${NC}"
    exit 1
}
docker-compose up -d || {
    echo -e "${RED}Failed to start backend services${NC}"
    exit 1
}

# Install frontend dependencies if needed
echo -e "\n${GREEN}Checking frontend dependencies...${NC}"
cd "$SCRIPT_DIR/frontend" || {
    echo -e "${RED}Frontend directory not found${NC}"
    exit 1
}
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install || {
        echo -e "${RED}Failed to install frontend dependencies${NC}"
        exit 1
    }
fi

# Start frontend development server
echo -e "\n${GREEN}Starting frontend development server...${NC}"
npm run dev &
FRONTEND_PID=$!

# Wait for frontend server to be ready
echo -e "\n${GREEN}Development environment is starting...${NC}"
echo -e "Frontend will be available at: http://localhost:5173"
echo -e "Backend API will be available at: http://localhost:8000"
echo -e "\n${GREEN}Press Ctrl+C to stop all services${NC}"

# Wait for user interrupt
wait $FRONTEND_PID