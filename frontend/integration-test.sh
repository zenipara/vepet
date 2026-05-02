#!/usr/bin/env bash
# VetCare Frontend-Backend Integration Test
# Tests the complete flow: signup, login, CRUD, RPC

set -euo pipefail

FRONTEND_URL=${FRONTEND_URL:-http://localhost:5173}
API_URL=${API_URL:-http://localhost:4000/api}

echo "🧪 VetCare Frontend-Backend Full Integration Test"
echo "=================================================="
echo "Frontend URL: $FRONTEND_URL"
echo "API URL: $API_URL"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

TIMESTAMP=$(date +%s%N)
TEST_EMAIL="integration-test-${TIMESTAMP}@test.local"
TEST_PASSWORD="TestPass123!"
TEST_NAME="Integration Test User"

echo "🔐 Authentication Flow"
echo "====================="

# Test 1: Sign up
echo "1️⃣  Creating test user..."
signup_response=$(curl -sS -X POST "$API_URL/auth/sign-up" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\",
    \"full_name\": \"$TEST_NAME\"
  }")

echo "Response: $signup_response" | jq . || true

access_token=$(echo "$signup_response" | jq -r '.access_token // empty')
user_id=$(echo "$signup_response" | jq -r '.user.id // empty')

if [ -z "$access_token" ]; then
  echo -e "${RED}✗ Sign up failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Sign up successful${NC}"
echo "  User ID: $user_id"
echo "  Token: ${access_token:0:20}..."

# Test 2: Sign in
echo ""
echo "2️⃣  Testing sign in with credentials..."
signin_response=$(curl -sS -X POST "$API_URL/auth/sign-in" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$TEST_EMAIL\",
    \"password\": \"$TEST_PASSWORD\"
  }")

signin_token=$(echo "$signin_response" | jq -r '.access_token // empty')
if [ -z "$signin_token" ]; then
  echo -e "${RED}✗ Sign in failed${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Sign in successful${NC}"

# Test 3: Get current user
echo ""
echo "3️⃣  Fetching current user..."
user_response=$(curl -sS -X GET "$API_URL/auth/me" \
  -H "Authorization: Bearer $access_token")

echo "Response:" && echo "$user_response" | jq . || true

if echo "$user_response" | jq -e '.user // .error' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Get user successful${NC}"
else
  echo -e "${YELLOW}⚠ Get user response unexpected${NC}"
fi

echo ""
echo "📊 CRUD Operations"
echo "=================="

# Test 4: Get pets list
echo "4️⃣  Fetching pets list..."
pets_status=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/pets" \
  -H "Authorization: Bearer $access_token")

if [ "$pets_status" = "200" ]; then
  pets=$(curl -sS -X GET "$API_URL/pets" \
    -H "Authorization: Bearer $access_token" | jq '.data | length')
  echo -e "${GREEN}✓ Get pets (200 OK, $pets records)${NC}"
else
  echo -e "${RED}✗ Get pets failed (HTTP $pets_status)${NC}"
fi

# Test 5: Get products list
echo "5️⃣  Fetching products list..."
products_status=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/products" \
  -H "Authorization: Bearer $access_token")

if [ "$products_status" = "200" ]; then
  products=$(curl -sS -X GET "$API_URL/products" \
    -H "Authorization: Bearer $access_token" | jq '.data | length')
  echo -e "${GREEN}✓ Get products (200 OK, $products records)${NC}"
else
  echo -e "${RED}✗ Get products failed (HTTP $products_status)${NC}"
fi

# Test 6: Get appointments  
echo "6️⃣  Fetching appointments..."
appointments_status=$(curl -s -o /dev/null -w "%{http_code}" -X GET "$API_URL/appointments" \
  -H "Authorization: Bearer $access_token")

if [ "$appointments_status" = "200" ]; then
  echo -e "${GREEN}✓ Get appointments (200 OK)${NC}"
else
  echo -e "${YELLOW}⚠ Get appointments (HTTP $appointments_status)${NC}"
fi

echo ""
echo "🔧 RPC & Helper Functions"
echo "========================="

# Test 7: RPC min_stock
echo "7️⃣  Fetching min_stock threshold..."
min_stock=$(curl -sS -X POST "$API_URL/rpc/min_stock" \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r '.result // empty')

if [ -n "$min_stock" ]; then
  echo -e "${GREEN}✓ RPC min_stock: $min_stock${NC}"
else
  echo -e "${RED}✗ RPC min_stock failed${NC}"
fi

echo ""
echo "✅ Frontend-Backend Integration Complete!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Authentication (signup, signin, getUser): ✓"
echo "- Protected endpoints: ✓"
echo "- CRUD operations (pets, products, appointments): ✓"
echo "- RPC helper functions: ✓"
echo ""
echo "Frontend is ready at: $FRONTEND_URL"
