# Hey Jack — Here's What You Need to Know

Welcome to Provenance as a Service. You're team lead. This doc gets you oriented.

## The One-Sentence Pitch

We built a platform that proves human creative authority in AI-assisted music — using Hedera Consensus Service, Decentralized Identifiers, and Verifiable Credentials.

**Tagline:** "AI made the music. The blockchain proves I'm the artist."

## The Problem We're Solving

When an artist uses Suno to make a song, nobody can tell if they directed a creative process or just pressed a button. Distributors (Spotify, Apple Music) are rejecting AI-assisted music because there's no standard for proving human involvement.

We prove the **process**, not the output.

## How It Works (The Stack)

```
Browser → Rails App (port 3334) → Node.js Hedera Service (port 3335) → Hedera Testnet
```

Two servers. That's it.

**Rails app** — The UI. Songs, artists, contributions, provenance certificates.
**Hedera service** — The blockchain layer. Creates topics, submits messages, issues DIDs and VCs.

They talk via HTTP. Rails calls the Node service for anything that touches Hedera.

## Key Concepts (Read WHITEPAPER.md for the full version)

**HCS Topics** — Each song, artist, or album gets a "topic" on Hedera. Like a page in a notebook nobody can erase. Topic IDs look like `0.0.7930484`.

**Contributions** — Every creative decision (wrote a prompt, generated audio, rejected a draft, approved a master) gets logged as a message on the song's topic. Timestamped by Hedera, not by us.

**DIDs** — Decentralized Identifiers. Each artist gets a permanent identity on Hedera: `did:hedera:testnet:{key}_{topicId}`. Like a passport nobody can forge.

**Verifiable Credentials (VCs)** — When production is complete, the platform issues a W3C credential signed by both the artist AND the platform (sentinel). It says "this person made this, here's the proof."

**Sentinel** — The platform's own DID. It co-signs every credential as a trusted witness. Without the sentinel signature, a credential is incomplete.

**Collaborative Splits** — Multiple artists, each with a DID, each with an ownership percentage that must total 100%. The VC IS the agreement.

**Revocation** — You can't delete from Hedera. Instead, you add a RevocationNotice. The audit trail shows both: issuance AND revocation.

## The Five Layers (This Is the Architecture)

| Layer | What It Does | Implementation |
|-------|-------------|----------------|
| **Primitives** | Define what can exist | HCS topics, SHA-256 hashes, DID strings |
| **Ontology** | Define how things connect | Artists→DIDs, Songs→Topics, Contributions→Messages |
| **Assertions** | Define what happened | W3C Verifiable Credentials, signed claims |
| **Sentinels** | Define who gets to say so | Platform DID co-signs every credential |
| **State** | What we compute from truth | Provenance chains, ownership splits, verification |

## The Repo Structure

```
hedera-hackathon/
├── app/                          # Rails app (MVC)
│   ├── controllers/              # Songs, Contributions, TopicExplorer
│   ├── models/                   # Song, Track, Contribution, ProvenanceRecord
│   ├── services/                 # HederaService (calls Node service), ProvenancePackageService
│   └── views/                    # UI templates
├── hedera/                       # Node.js Hedera microservice
│   ├── server.js                 # Express server — ALL the Hedera logic lives here
│   ├── .env                      # Credentials (gitignored, never commit)
│   ├── .sentinel.json            # Platform DID state (gitignored, auto-created)
│   ├── test-scenarios.js         # 6 trust test scenarios
│   ├── test-results.txt          # Output from test run
│   ├── replay-album.js           # "Let's Stay This Way" album replay script
│   ├── album-replay-results.txt  # Output from album replay
│   └── test-did-sdk.js           # DID SDK spike test
├── explorer.html                 # Standalone topic viewer (open in browser)
├── WHITEPAPER.md                 # Plain-language explanation (~3,500 words)
├── THESIS.md                     # Academic-ish thesis (~2,800 words)
├── DIAGRAMS.md                   # 10 Mermaid diagrams
├── GAMEPLAN.md                   # Original hackathon strategy
├── INNOVATION.md                 # Innovation narrative
├── FEASIBILITY.md                # Feasibility analysis
└── JACK.md                       # You are here
```

## Running It Locally

### Prerequisites
- Node.js (v20+)
- Ruby 4.0.1 (via mise: `mise use ruby@4.0.1`)
- PostgreSQL running
- Hedera testnet account (already configured in `hedera/.env`)

### Start the Hedera service
```bash
cd hedera
npm install          # first time only
node server.js       # starts on port 3335
```

You'll see:
```
🚀 Hedera HCS service running on http://localhost:3335
🛡️  Sentinel DID loaded: did:hedera:testnet:...
```

### Start the Rails app (separate terminal)
```bash
cd ..                # back to project root
export PATH="/Users/dimension/.local/share/mise/installs/ruby/4.0.1/bin:$PATH"
bundle install       # first time only
bin/rails db:create db:migrate  # first time only
bin/rails server -p 3334
```

### View the explorer
```bash
open explorer.html   # standalone, no server needed
```

## server.js — The Important Endpoints

| Endpoint | What It Does |
|----------|-------------|
| `POST /artists` | Register artist DID (creates topic, publishes DID doc) |
| `GET /artists/:topicId/did` | Resolve an artist's DID document |
| `GET /sentinel` | Get the platform's sentinel DID |
| `POST /topics` | Create a new HCS topic |
| `POST /topics/:id/messages` | Submit a message to a topic |
| `GET /topics/:id/messages` | Read messages from mirror node |
| `POST /credentials` | Issue a Verifiable Credential (dual-signed) |
| `POST /credentials/verify` | Verify a VC (structure, signatures, shares, sentinel) |
| `GET /health` | Health check |

## What's On Hedera Right Now

### The Album: "Let's Stay This Way"
- **Album topic:** [0.0.7930484](https://hashscan.io/testnet/topic/0.0.7930484)
- 12 tracks, 77 contributions, 4 VCs
- Paste any topic ID into `explorer.html` to see it rendered

### Test Scenarios
- 6 scenarios covering solo lifecycle, collab splits, invalid rejection, revocation, sentinel authority, artist identity
- Run: `cd hedera && node test-scenarios.js` (server must be running)

### Key Topic IDs
| What | Topic ID |
|------|----------|
| Album | 0.0.7930484 |
| Screwed (Track 1) | 0.0.7930486 |
| Ciudad (Track 3) | 0.0.7930493 |
| Already True (Track 6) | 0.0.7930499 |
| Jon Bon Buckle (original) | 0.0.7928916 |
| Tacos at 3am | 0.0.7928902 |
| Sentinel DID | 0.0.7929544 |

## What Costs What

- Create topic: $0.01
- Submit message: $0.0008
- Entire album (12 tracks, 77 messages, 4 VCs): **$0.26**
- Single song with solo artist: ~$0.03

## The Team

- **You (Jack)** — Team Lead. Your name is on the submission.
- **Jeff** — Technical advisor. Built the platform. Anonymous behind devcoband-ai org.
- **Jon Bon Buckle** — President of Local Records USA. Domain expert. Will present the demo video.

## What Still Needs to Happen

1. **StackUp registration** — Opens Feb 17. You register the team.
2. **Tufte styling** — The Rails app needs to look polished.
3. **Deploy somewhere** — Judges need a live URL. Render, Railway, or Fly.io.
4. **Demo video** — Jon walks through the product on camera. Upload to YouTube.
5. **Pitch deck PDF** — Slides summarizing the project.
6. **100-word description** — For the submission form.
7. **Deadline: March 23, 11:59pm ET**

## Read These (In Order)

1. This file (done ✅)
2. `WHITEPAPER.md` — The full explanation in plain language
3. `THESIS.md` — The intellectual argument
4. `DIAGRAMS.md` — Visual architecture (paste into any Mermaid renderer)
5. `hedera/server.js` — The blockchain logic (read top to bottom, it's well-commented)
6. `explorer.html` — Open it, click around, see what's on-chain

## Questions?

Run `node hedera/server.js`, open `explorer.html`, and click "Album." Everything we built is right there on Hedera. Immutable. Provable. Yours to present.

You got this. 💪
