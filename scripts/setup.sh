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
  echo "⚠️  Silakan edit .env.local dengan Supabase credentials Anda"
fi

cd ..

echo ""
echo "✓ Frontend setup selesai!"
echo ""
echo "======================================"
echo "🚀 Quick Start:"
echo ""
echo "1. Setup Supabase:"
echo "   - Buka https://supabase.com dan buat project"
echo "   - Copy Project URL dan Anon Key"
echo "   - Edit frontend/.env.local"
echo ""
echo "2. Run migrations:"
echo "   - Copy isi supabase/migrations/*.sql ke Supabase Dashboard → SQL Editor"
echo "   - Atau gunakan Supabase CLI: supabase db push"
echo ""
echo "3. Start development:"
echo "   cd frontend && npm run dev"
echo ""
echo "4. Open browser:"
echo "   http://localhost:5173"
echo ""
echo "======================================"
