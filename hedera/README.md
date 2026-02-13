# Hedera HCS Microservice

Node.js service that provides REST endpoints for Hedera Consensus Service (HCS). Runs alongside the Rails app.

## Setup

### 1. Get Testnet Credentials

1. Go to [Hedera Portal](https://portal.hedera.com/faucet)
2. Create a testnet account
3. Copy your **Account ID** (e.g., `0.0.12345`) and **DER-encoded private key**

### 2. Configure Environment

```bash
cd hedera/
cp .env.example .env
# Edit .env with your credentials
```

### 3. Install & Run

```bash
npm install
npm start        # production
npm run dev      # development (auto-reload)
```

The service runs on **port 3335** by default.

## API Endpoints

### `POST /topics`
Create a new HCS topic.

```json
// Request
{ "memo": "My Song Title" }

// Response
{ "topicId": "0.0.12345" }
```

### `POST /topics/:topicId/messages`
Submit a message to a topic.

```json
// Request (any JSON body)
{ "role": "songwriter", "actor_name": "Jeff", "description": "Wrote lyrics" }

// Response
{ "sequenceNumber": "1", "timestamp": "2026-02-13T22:00:00.000Z" }
```

### `GET /topics/:topicId/messages`
Read all messages from a topic (via Mirror Node).

```json
// Response
[
  {
    "sequenceNumber": 1,
    "timestamp": "1234567890.123456789",
    "message": { "role": "songwriter", "actor_name": "Jeff", "description": "Wrote lyrics" }
  }
]
```

### `GET /health`
Health check.

## How It Connects to Rails

The Rails app calls this service via `HederaService` (`app/services/hedera_service.rb`):
- When a **song is created** → creates an HCS topic (immutable provenance ledger)
- When a **contribution is added** → submits the contribution data as a message to the song's topic
- All data is recorded on the Hedera public ledger and viewable on [HashScan](https://hashscan.io/testnet)

## Architecture

```
Rails App (port 3334) → HTTP → Hedera Service (port 3335) → Hedera Testnet
```
