# Go Realtime WebSocket Service Deployment Guide

## Overview

The Go Realtime Service is a lightweight WebSocket server that broadcasts real-time updates to connected clients. Supports live notifications, appointment status changes, and recovery journey tracking.

## Deployment Steps

### 1. Render.com Deployment

#### Create Background Worker

1. Go to [render.com](https://render.com)
2. Create new **Background Worker**
3. Configure:
   - **Name**: `vetcare-realtime`
   - **Root Directory**: `services/realtime`
   - **Build Command**: `go mod download && go build -o vetcare-realtime`
   - **Start Command**: `./vetcare-realtime`
   - **Plan**: Free works fine for MVP

#### Set Environment Variables

```
PORT=4001
DATABASE_URL=<from Render Postgres>
JWT_SECRET=<same as API Gateway>
SERVICE_AUTH_TOKEN=<same as API Gateway>
```

#### Deploy

1. Paste environment variables
2. Click **Deploy**
3. Wait for build (~2-3 minutes)
4. Get public WebSocket URL: `wss://vetcare-realtime.onrender.com`

### 2. Configure Frontend

Update GitHub Actions secrets or frontend .env:

```
VITE_WS_URL=wss://vetcare-realtime.onrender.com
```

Update frontend components to connect to WebSocket:

```javascript
// In frontend/src/hooks/useRealtime.ts or similar
const ws = new WebSocket(import.meta.env.VITE_WS_URL + '/ws');
```

### 3. Test Connection

```bash
# From terminal (OSX/Linux)
wscat -c wss://vetcare-realtime.onrender.com/ws

# Or in browser console
const ws = new WebSocket('wss://vetcare-realtime.onrender.com/ws');
ws.onopen = () => console.log('Connected');
ws.onmessage = (e) => console.log('Msg:', e.data);
```

## Local Development

```bash
cd services/realtime

# Setup
cp .env.example .env.local
# Edit .env.local

# Run
go run main.go

# Connect via WebSocket
# ws://localhost:4001/ws
```

## Testing

### Simple WebSocket Test

```bash
# Install wscat
npm install -g wscat

# Connect
wscat -c ws://localhost:4001/ws

# Send message
{"type":"test","data":"hello"}

# Should broadcast to all clients
```

### Browser Console Test

```javascript
const ws = new WebSocket('ws://localhost:4001/ws');
ws.onopen = () => ws.send(JSON.stringify({type:'test',msg:'hello'}));
ws.onmessage = (e) => console.log(e.data);
```

## Monitoring

### Render Dashboard

1. Go to `vetcare-realtime` service
2. Click **Logs** to see active connections
3. Check **Metrics** for resource usage

### Local Development

Server logs show:
- Client connections: `Client registered: client-123 (total: 5)`
- Client disconnections: `Client unregistered: client-123 (total: 4)`
- Health checks: `GET /health 200`

## Troubleshooting

### Connection Refused

**Error**: `Connection refused`

**Fix**: Ensure service is running and firewall allows WebSocket connections

### CORS Issues

**Error**: `The CORS protocol does not allow specifying a wildcard...`

**Fix**: WebSocket CORS isn't standard browser CORS. Check `CheckOrigin` function in code.

### High Memory Usage

**Error**: Service memory keeps increasing

**Fix**: Implement backpressure / disconnect inactive clients (TODO)

## Architecture

### Message Flow

```
API Gateway      →  Realtime Service  →  Browser Clients
                     (WebSocket Hub)
```

### Current Implementation

- Simple broadcast to all connected clients
- No authentication per message (TODO)
- No channel subscriptions (TODO)
- No persistence (TODO)

### Future Enhancements

```
┌─────────────────────────────────────┐
│ Real-time Features (Phase 2+)       │
├─────────────────────────────────────┤
│ ✅ WebSocket server (basic)         │
│ ⏳ Channel subscriptions             │
│ ⏳ Message authentication            │
│ ⏳ Database event listeners          │
│ ⏳ Redis persistence                 │
│ ⏳ Metrics & monitoring              │
└─────────────────────────────────────┘
```

## API Integration

### Broadcasting from API Gateway

To send updates from Node.js API Gateway to WebSocket clients:

**Option 1: HTTP API** (future)
```javascript
// In backend/src/routes/notify.ts
POST /api/notify
{
  "channel": "appointments",
  "event": "status_changed",
  "data": { ... }
}
```

**Option 2: Database Events** (future)
```sql
NOTIFY appointments, 'appointment_updated';
```

**Option 3: Manual Connection** (for now)
```javascript
const ws = new WebSocket(process.env.REALTIME_URL);
ws.send(JSON.stringify({...}));
```

## Supporting Docs

- Backend README: [backend/README.md](../../backend/README.md)
- Backend Deployment: [BACKEND_DEPLOYMENT_GUIDE.md](../BACKEND_DEPLOYMENT_GUIDE.md)
- Architecture: [README.md](../../README.md)
