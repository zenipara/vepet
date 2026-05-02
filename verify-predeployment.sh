#!/bin/bash

# 🧪 VetCare - Pre-Deployment Verification Script
# Usage: bash verify-predeployment.sh

echo "🔍 VetCare Pre-Deployment Verification"
echo "======================================="

CHECKS_PASSED=0
CHECKS_FAILED=0

run_check() {
    local check_name=$1
    local check_command=$2
    echo -n "✓ $check_name... "
    if eval "$check_command" > /dev/null 2>&1; then
        echo "OK"
        ((CHECKS_PASSED++))
    else
        echo "FAILED"
        ((CHECKS_FAILED++))
    fi
}

echo ""
echo "1️⃣ Tools & Dependencies"
run_check "Node.js installed" "node --version"
run_check "npm installed" "npm --version"
run_check "Go installed" "go version"
run_check "Git installed" "git --version"

echo ""
echo "2️⃣ Project Structure"
run_check "frontend directory exists" "test -d frontend/src"
run_check "backend directory exists" "test -d backend/src"
run_check "realtime directory exists" "test -d services/realtime"
run_check "database migrations directory exists" "test -d database/migrations"

echo ""
echo "3️⃣ Configuration Files"
run_check "frontend/.env.example" "test -f frontend/.env.example"
run_check "backend/.env.example" "test -f backend/.env.example"
run_check "realtime/.env.example" "test -f services/realtime/.env.example"

echo ""
echo "4️⃣ Backend Source Files"
run_check "backend/src/server.ts" "test -f backend/src/server.ts"
run_check "backend/src/utils/jwt.ts" "test -f backend/src/utils/jwt.ts"
run_check "backend/src/controllers/auth.ts" "test -f backend/src/controllers/auth.ts"
run_check "backend/src/controllers/crud.ts" "test -f backend/src/controllers/crud.ts"
run_check "backend/src/controllers/upload.ts" "test -f backend/src/controllers/upload.ts"

echo ""
echo "5️⃣ Realtime Service"
run_check "services/realtime/main.go" "test -f services/realtime/main.go"
run_check "services/realtime/go.mod" "test -f services/realtime/go.mod"

echo ""
echo "6️⃣ Frontend Updates"
run_check "frontend API shim" "test -f frontend/src/lib/supabaseClient.ts"
run_check "frontend package.json" "test -f frontend/package.json"

echo ""
echo "7️⃣ Database Migrations"
run_check "Migration 001_initial_schema.sql" "test -f database/migrations/001_initial_schema.sql"
run_check "Migration 002_functions_and_triggers.sql" "test -f database/migrations/002_functions_and_triggers.sql"
run_check "Migration 003_rls_policies.sql" "test -f database/migrations/003_rls_policies.sql"

echo ""
echo "8️⃣ Deployment Documentation"
run_check "README.md" "test -f README.md"
run_check "DEPLOYMENT_ARCHITECTURE.md" "test -f DEPLOYMENT_ARCHITECTURE.md"
run_check "DEPLOYMENT_GUIDE.md" "test -f DEPLOYMENT_GUIDE.md"
run_check "Seed script (psql)" "test -f scripts/seed-db.sh"

echo ""
echo "======================================="
echo "Results: ✅ $CHECKS_PASSED passed | ❌ $CHECKS_FAILED failed"
echo "======================================="

if [ $CHECKS_FAILED -eq 0 ]; then
    echo ""
    echo "🎉 All checks passed! System ready for deployment."
    echo ""
    echo "Next Steps:"
    echo "1. Read: DEPLOYMENT_GUIDE.md"
    echo "2. Setup: Render.com infrastructure"
    echo "3. Deploy: API Gateway (backend/)"
    echo "4. Deploy: Realtime Service (services/realtime/)"
    echo "5. Deploy: Frontend (GitHub Pages)"
    echo ""
    exit 0
else
    echo ""
    echo "⚠️  Please fix the issues above before deployment."
    exit 1
fi
