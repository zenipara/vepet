#!/bin/bash

# VetCare Post-Deployment Verification Script
# Run this after deployment to verify everything is working

set -e

echo "🔍 VetCare Deployment Verification"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="zenipara/VetCare"
LIVE_URL="https://zenipara.github.io/VetCare/"
API_URL="https://api.yourdomain.com" # replace with your API gateway URL

# Helper functions
check_url() {
    local url=$1
    local name=$2
    
    echo -n "Checking $name... "
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✅ OK${NC}"
        return 0
    else
        echo -e "${RED}❌ FAILED${NC}"
        return 1
    fi
}

check_github_actions() {
    echo -n "Checking GitHub Actions status... "
    if gh run list -R "$GITHUB_REPO" -L 1 --json conclusion -q 2>/dev/null | grep -q "success"; then
        echo -e "${GREEN}✅ PASSED${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  CHECK MANUALLY${NC}"
        echo "   Visit: https://github.com/$GITHUB_REPO/actions"
        return 0
    fi
}

check_postgres_schema() {
    echo -n "Checking Postgres schema... "
    # This is a manual check placeholder - credentials required for automated checks
    echo -e "${YELLOW}⚠️  MANUAL CHECK${NC}"
    echo "   Visit your Postgres instance (Render dashboard or psql) and verify expected tables: profiles, pets, bookings, appointments, emr_records, ..."
}

# Checks
echo "1. GitHub Configuration"
echo "----------------------"
check_github_actions
echo ""

echo "2. Live Application"
echo "-------------------"
check_url "$LIVE_URL" "VetCare homepage"
echo ""

echo "3. API Backend"
echo "-------------------"
check_url "$API_URL" "API Gateway"
check_postgres_schema
echo ""

echo "4. Verification Checklist"
echo "-------------------------"

checks=(
    "GitHub Pages site is live"
    "No JavaScript errors in browser console"
    "Homepage loads and displays correctly"
    "Navigation menu works"
    "Login page accessible at /login"
    "Database tables created (check Postgres)"
    "DB policies applied (where applicable)"
    "Realtime service reachable (WebSocket)"
)

for i in "${!checks[@]}"; do
    echo "$((i+1)). ${checks[$i]}"
done

echo ""
echo "5. Browser Console Test"
echo "------------------------"
echo -e "${YELLOW}Manual Step:${NC}"
echo "1. Open: $LIVE_URL"
echo "2. Press F12 to open developer tools"
echo "3. Go to Console tab"
echo "4. Look for API initialization logs and network calls to your API gateway"
echo "5. Verify no red errors appear"
echo ""

echo "✅ Verification Complete!"
echo ""
echo "🎓 Next Steps:"
echo "  1. Open: $LIVE_URL"
echo "  2. Try login (use test account)"
echo "  3. Create a pet"
echo "  4. Make a booking"
echo "  5. Check EMR features"
echo ""
echo "📞 If issues found:"
echo "  - Check GitHub Actions logs: https://github.com/$GITHUB_REPO/actions"
echo "  - Check browser console (F12) for errors"
echo "  - Check your Postgres instance or API dashboard for database status"
echo ""
