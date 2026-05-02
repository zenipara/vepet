#!/bin/bash

# VetCare PostgreSQL Docker Setup
# Quick setup: ./setup-docker-db.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║     VetCare PostgreSQL Docker Setup            ║"
echo "║     Starts PostgreSQL 15 in Docker             ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}✗ Docker is not installed${NC}"
    echo "Install Docker from https://www.docker.com/"
    exit 1
fi

echo -e "${GREEN}✓ Docker is installed${NC}"
echo ""

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q vetcare-db; then
    echo -e "${YELLOW}⚠️  Container 'vetcare-db' already exists${NC}"
    echo ""
    echo -e "${BLUE}Checking if running...${NC}"
    if docker ps --format '{{.Names}}' | grep -q vetcare-db; then
        echo -e "${GREEN}✓ Container is already running${NC}"
        CONTAINER_IP=$(docker inspect vetcare-db --format='{{.NetworkSettings.IPAddress}}')
        echo "  Container IP: $CONTAINER_IP"
        echo "  Port: 5432"
        echo ""
    else
        echo -e "${YELLOW}Restarting container...${NC}"
        docker start vetcare-db
        echo -e "${GREEN}✓ Container restarted${NC}"
    fi
else
    echo -e "${BLUE}Creating PostgreSQL container...${NC}"
    docker run --name vetcare-db \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=postgres \
        -e POSTGRES_DB=vetcare \
        -p 5432:5432 \
        -d postgres:15-alpine
    
    echo -e "${GREEN}✓ Container created${NC}"
    
    # Wait for database to be ready
    echo ""
    echo -e "${BLUE}Waiting for database to be ready...${NC}"
    sleep 3
    
    # Verify container is running
    if docker ps --format '{{.Names}}' | grep -q vetcare-db; then
        echo -e "${GREEN}✓ Container is running${NC}"
    else
        echo -e "${RED}✗ Container failed to start${NC}"
        echo "Check logs with: docker logs vetcare-db"
        exit 1
    fi
fi

echo ""
echo -e "${BLUE}PostgreSQL Connection Details:${NC}"
echo "  Host:     localhost"
echo "  Port:     5432"
echo "  User:     postgres"
echo "  Password: postgres"
echo "  Database: vetcare"
echo ""

echo -e "${YELLOW}Connection String:${NC}"
echo "  postgresql://postgres:postgres@localhost:5432/vetcare"
echo ""

echo -e "${BLUE}Useful Docker Commands:${NC}"
echo "  View logs:      docker logs -f vetcare-db"
echo "  Stop container: docker stop vetcare-db"
echo "  Start container: docker start vetcare-db"
echo "  Connect with psql:"
echo "    psql -U postgres -h localhost -d vetcare"
echo ""

echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Export DATABASE_URL:"
echo "     export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/vetcare'"
echo ""
echo "  2. Run migrations:"
echo "     ./database/setup-db.sh"
echo ""
echo "  3. Or manually:"
echo "     psql \$DATABASE_URL -f database/migrations/001_initial_schema_standalone.sql"
echo "     psql \$DATABASE_URL -f database/seed_standalone.sql"
echo ""

echo -e "${GREEN}✓ PostgreSQL Docker Setup Complete!${NC}"
