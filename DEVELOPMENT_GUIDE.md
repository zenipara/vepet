# 📖 VetCare Development Guide

**Architecture**: Custom Backend (Node.js + Go + PostgreSQL)  
**Last Updated**: May 1, 2026  
**Status**: Production Ready

---

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js 18+ 
- Go 1.21+
- PostgreSQL 14+ (or use Render managed DB)
- Git

### Setup Local Environment

```bash
# Clone and navigate
# Development Reference (moved)

Konten terperinci tentang workflow, struktur proyek, perintah pengembangan, endpoint API, dan standar pengkodean telah dipindahkan/diringkas di:

- [SETUP_GUIDE.md](SETUP_GUIDE.md) — local setup & quick start
- [backend/README.md](backend/README.md) — API-specific docs
- [services/realtime/README.md](services/realtime/README.md) — Realtime service docs

Jika Anda memerlukan bagian tertentu dari `DEVELOPMENT_GUIDE.md` dipertahankan sebagai dokumen terpisah, beri tahu saya bagian mana yang penting.
DELETE FROM [table_name];

-- Drop table
DROP TABLE [table_name];
```

### Check Migrations Status
```sql
-- Migrations are applied directly, not tracked in a table
-- Verify by checking if tables exist:
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

---

## 🐛 Debugging Tips

### Frontend Issues
- Open DevTools: `F12` or `Ctrl+Shift+I`
- Check Network tab for API calls
- Check Console for errors
- Use `console.log()` for debugging
- Use React DevTools browser extension

### Backend Issues
- Check logs: `npm run dev` shows console output
- Use `console.log()` for debugging
- Check environment variables: `cat .env` (don't commit!)
- Test endpoints with cURL or Postman
- Enable SQL query logging (see backend README)

### Database Issues
- Connect with `psql` and run queries directly
- Check for connection errors in backend logs
- Verify migrations applied: `\dt` in psql
- Check for permission issues

### Realtime Issues
- Test WebSocket connection: `websocat wss://localhost:4001/ws` (install websocat)
- Check Go server logs
- Verify JWT token is valid
- Test with browser console:
  ```javascript
  ws = new WebSocket('ws://localhost:4001/ws');
  ws.onopen = () => console.log('Connected');
  ws.onmessage = (e) => console.log('Message:', e.data);
  ```

---

## 🚀 Building for Production

### Frontend
```bash
cd frontend
npm run build

# Output: dist/ folder ready for GitHub Pages
# Preview: npm run preview
```

### Backend
```bash
cd backend
npm run build

# Output: dist/ folder ready for deployment
# Start: NODE_ENV=production npm start
```

### Realtime
```bash
cd services/realtime
go build -o vetcare-realtime .

# Output: vetcare-realtime binary ready for deployment
```

---

## 📦 Dependencies

### Frontend Key Packages
- React 18 - UI library
- TypeScript - Type safety
- Vite - Build tool
- TailwindCSS - Styling
- React Router - Routing
- Zustand - State management
- Axios - HTTP client

### Backend Key Packages
- Express.js - Web framework
- PostgreSQL (pg) - Database driver
- jsonwebtoken - JWT authentication
- bcryptjs - Password hashing
- @aws-sdk/client-s3 - Cloudflare R2 client
- TypeScript - Type safety
- dotenv - Environment variables

### Realtime Key Packages
- github.com/gorilla/websocket - WebSocket library
- github.com/joho/godotenv - Environment variables
- github.com/lib/pq - PostgreSQL driver

---

## 🔒 Security Checklist

### Frontend
- [ ] Never commit `.env.local`
- [ ] No API keys directly in code
- [ ] Validate user input
- [ ] Use HTTPS in production
- [ ] Sanitize user-generated content

### Backend
- [ ] Use strong JWT secrets (32+ chars)
- [ ] Hash passwords with bcryptjs
- [ ] Validate all inputs
- [ ] Use prepared statements (pg library does this)
- [ ] Enable CORS only for trusted origins
- [ ] Implement rate limiting (future)
- [ ] Log security events

### Database
- [ ] Use strong passwords
- [ ] Enable SSL/TLS connections
- [ ] Use Row-Level Security (RLS policies)
- [ ] Regular backups
- [ ] Monitor access logs

---

## 📚 Additional Resources

### Documentation
- [README.md](README.md) - Project overview
- [SETUP_GUIDE.md](SETUP_GUIDE.md) - Installation guide
- [backend/README.md](backend/README.md) - API documentation
- [services/realtime/README.md](services/realtime/README.md) - Realtime docs

### External Docs
- [Express.js](https://expressjs.com/)
- [React](https://react.dev/)
- [PostgreSQL](https://www.postgresql.org/docs/)
- [Gorilla WebSocket](https://pkg.go.dev/github.com/gorilla/websocket)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [pgAdmin](https://www.pgadmin.org/) - Database GUI
- [VS Code](https://code.visualstudio.com/) - Editor
- [Git](https://git-scm.com/) - Version control

---

## 💬 Common Questions

**Q: How do I change an API endpoint?**  
A: Edit `backend/src/routes/` files and restart dev server.

**Q: How do I add a new database table?**  
A: Create a migration in `supabase/migrations/` and apply it.

**Q: How do I update the frontend?**  
A: Edit files in `frontend/src/` - Vite auto-reloads.

**Q: How do I debug the database?**  
A: Connect with `psql` and run SQL queries directly.

**Q: Can I use Supabase anymore?**  
A: No - the project has been fully migrated away from Supabase to custom backend.

**Q: How do I test WebSocket connections?**  
A: See "Realtime Issues" debugging section above.

---

## 🎯 Next Steps

1. **Setup**: Follow "Quick Start" section above
2. **Explore**: Read through backend/README.md and frontend code
3. **Code**: Start implementing features
4. **Test**: Test locally before pushing
5. **Deploy**: Follow DEPLOYMENT_NEXT_STEPS_FINAL.md when ready

---

**Questions? Errors?** Check DOCUMENTATION_STATUS.md for help resources.

**Last Updated**: May 1, 2026  
**Maintained By**: VetCare Development Team
