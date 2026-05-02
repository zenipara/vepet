# VetCare System

VetCare is a veterinary clinic management platform with a custom backend stack: Node.js API, Go realtime service, PostgreSQL, and Cloudflare R2.

## Start Here

- **Local setup**: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- **Deployment**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Documentation map**: [DOCS.md](DOCS.md)

## Stack

- Frontend: React + Vite on GitHub Pages
- API: Node.js + Express on Render
- Realtime: Go WebSocket service on Render
- Database: PostgreSQL
- Storage: Cloudflare R2

## Architecture

```text
Browser → GitHub Pages
   ↓ REST
Node.js API → PostgreSQL + Cloudflare R2
   ↓ WebSocket
Go Realtime Service ↔ PostgreSQL
```

## What this repo contains

- `frontend/` - React app and UI
- `backend/` - API gateway
- `services/realtime/` - Go websocket service
- `database/` - SQL migrations and seed data
- `scripts/` - setup and deployment helpers

## Contributing

- Use `database/migrations/` for schema changes.
- Keep environment variables in `.env.example` files.
- Run `bash verify-predeployment.sh` before pushing.

## Support

- Setup questions: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Deployment questions: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- Full navigation: [DOCS.md](DOCS.md)
