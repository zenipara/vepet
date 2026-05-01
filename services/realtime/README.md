# VetCare Realtime WebSocket Service

Go-based WebSocket service for real-time updates (live notifications, recovery journey tracking, appointment status changes).

## Features

- **WebSocket Server** - Gorilla WebSocket implementation
- **Message Broadcasting** - Distribute updates to all connected clients
- **Low Latency** - Optimized for real-time performance
- **Scalable** - Can handle hundreds of concurrent connections

## Quick Start

### Prerequisites
- Go >= 1.21
- PostgreSQL (for eventual integration)

### Setup

```bash
# Install dependencies
go mod download

# Create .env
cp .env.example .env.local
# Edit .env.local with your values
```

### Run

```bash
# Development
go run main.go

# Or build and run
go build -o vetcare-realtime
./vetcare-realtime
```

Server will run on `ws://localhost:4001`

## Usage

### Client-Side (Browser)

```javascript
const ws = new WebSocket('ws://localhost:4001/ws');

ws.onopen = () => {
  console.log('Connected');
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'appointments' }));
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected');
};
```

### Server-Side Broadcast (from API Gateway)

The API Gateway or other services can broadcast messages to WebSocket clients via:

1. **HTTP POST** to a broadcast endpoint (TODO: add HTTP API)
2. **Direct connection** to Realtime service database events (TODO: add pg_notify)
3. **Message queue** like Redis (TODO: add Redis integration)

## API Endpoints

### WebSocket (`/ws`)

- **Connect**: `ws://localhost:4001/ws`
- **Client ID Header**: `X-Client-ID` (optional, auto-assigned if missing)

### HTTP

- `GET /health` - Health check

## Environment Variables

```env
PORT=4001
DATABASE_URL=postgres://...
JWT_SECRET=your-secret
SERVICE_AUTH_TOKEN=your-token
WS_PATH=/ws
MAX_MESSAGE_SIZE=65536
```

## Architecture

```
services/realtime/
├── main.go          # WebSocket server
├── go.mod           # Dependencies
├── go.sum           # Lock file
├── .env.example     # Config template
└── README.md        # This file
```

## Message Format

Expected JSON message format:

```json
{
  "type": "update",
  "channel": "appointments|recovery|notifications",
  "user_id": "user-123",
  "data": {
    "id": "...",
    "status": "updated",
    "timestamp": "2025-01-01T00:00:00Z"
  }
}
```

## Deployment

### Run on Render.com

1. Create new **Background Worker** on Render
2. Set:
   - **Name**: `vetcare-realtime`
   - **Build Command**: `go mod download && go build -o vetcare-realtime`
   - **Start Command**: `./vetcare-realtime`
3. Set environment variables
4. Deploy

Get public WebSocket URL: `wss://vetcare-realtime.onrender.com/ws`

### Update Frontend `.env`

```
VITE_WS_URL=wss://vetcare-realtime.onrender.com
```

## Future Enhancements

- [ ] Authentication/authorization per message
- [ ] Channel-based subscriptions (only receive relevant updates)
- [ ] Message persistence (Redis queue)
- [ ] Database event listening (pg_notify)
- [ ] Message compression
- [ ] Reconnection logic & state sync
- [ ] Metrics & monitoring

## Development

### Build
```bash
go build -o vetcare-realtime
```

### Format
```bash
gofmt -s -w .
```

### Lint
```bash
golangci-lint run ./...
```

## Contributing

See main [README.md](../../README.md) for contribution guidelines.
