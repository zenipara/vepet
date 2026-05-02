#!/bin/bash

echo "🐾 VetCare System - Setup Script"
echo "======================================"

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js tidak terinstall. Silakan install Node.js >= 18.x"
  exit 1
fi

echo "✓ Node.js $(node --version)"

# Frontend setup
echo ""
echo "📦 Setup Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
else
  echo "Dependencies sudah terinstall"
fi

# Create .env.local if not exists
if [ ! -f ".env.local" ]; then
  echo "Creating .env.local from template..."
  cp .env.example .env.local
  echo "⚠️  Silakan edit .env.local dengan API dan database credentials Anda"
fi

cd ..

echo ""
echo "✓ Frontend setup selesai!"
echo ""
echo "======================================"
echo "🚀 Quick Start:"
echo ""
echo "1. Setup API dan database:"
echo "   - Siapkan DATABASE_URL untuk PostgreSQL"
echo "   - Edit frontend/.env.local"
echo ""
echo "2. Run migrations:"
echo "   - Jalankan bash scripts/deploy-db.sh"
echo "   - Atau jalankan psql terhadap database/migrations/*.sql"
echo ""
echo "3. Start development:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "======================================"
