#!/bin/bash

# VetCare Database Setup Script
# Supports: Local PostgreSQL, Docker, Render.com

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔════════════════════════════════════════════════╗"
echo "║     VetCare Database Setup Script              ║"
echo "║     Local PostgreSQL Setup                     ║"
echo "╚════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${YELLOW}⚠️  DATABASE_URL not set${NC}"
    echo ""
    echo "Option 1: Local PostgreSQL (Docker)"
    echo "  export DATABASE_URL='postgresql://postgres:postgres@localhost:5432/vetcare'"
    echo ""
    echo "Option 2: Local PostgreSQL (Native)"
    echo "  export DATABASE_URL='postgresql://postgres:yourpassword@localhost:5432/vetcare'"
    echo ""
    echo "Option 3: Render.com"
    echo "  export DATABASE_URL='postgresql://user:pass@dpg-xxx.render.com:5432/vetcare'"
    echo ""
    exit 1
fi

echo -e "${GREEN}✓ Using DATABASE_URL${NC}"
echo "  Host: $(echo $DATABASE_URL | cut -d'@' -f2 | cut -d':' -f1)"
echo "  Database: vetcare"
echo ""

# Test connection
echo -e "${BLUE}Testing database connection...${NC}"
if psql $DATABASE_URL -c "SELECT version();" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Connection successful${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    echo "Make sure PostgreSQL is running and DATABASE_URL is correct"
    exit 1
fi

echo ""
echo -e "${BLUE}Step 1: Applying schema migration...${NC}"
psql $DATABASE_URL -f database/migrations/001_initial_schema_local.sql
echo -e "${GREEN}✓ Schema created successfully${NC}"

echo ""
echo -e "${BLUE}Step 2: Seeding test data...${NC}"
psql $DATABASE_URL -f database/seed_local.sql
echo -e "${GREEN}✓ Test data inserted successfully${NC}"

echo ""
echo -e "${BLUE}Step 3: Verifying database...${NC}"

USERS=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM users;")
PROFILES=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM profiles;")
PETS=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM pets;")
APPOINTMENTS=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM appointments;")
SERVICES=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM services;")
PRODUCTS=$(psql $DATABASE_URL -t -c "SELECT count(*) FROM products;")

echo ""
echo -e "${GREEN}Database Statistics:${NC}"
echo "  Users:        $USERS"
echo "  Profiles:     $PROFILES"
echo "  Pets:         $PETS"
echo "  Appointments: $APPOINTMENTS"
echo "  Services:     $SERVICES"
echo "  Products:     $PRODUCTS"

echo ""
if [ "$USERS" -gt 0 ]; then
    echo -e "${GREEN}✓ Database setup completed successfully!${NC}"
    echo ""
    echo -e "${YELLOW}Test Credentials:${NC}"
    echo "  Admin:     admin@vetcare.local"
    echo "  Doctor:    doctor1@vetcare.local"
    echo "  Customer:  customer1@vetcare.local"
    echo "  All passwords are hashed (use bcrypt for login)"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Update backend .env with DATABASE_URL"
    echo "  2. Run: cd backend && npm run dev"
    echo "  3. Test endpoints with Postman collection"
    echo ""
else
    echo -e "${RED}✗ Error: No data was inserted${NC}"
    exit 1
fi

echo -e "${BLUE}More information:${NC}"
echo "  Setup Guide: database/DATABASE_SETUP_GUIDE.md"
echo "  Migrations:  database/migrations/"
echo "  Seed Data:   database/seed_local.sql"
echo ""
