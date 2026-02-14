# Provenance as a Service

**AI made the music. The blockchain proves I'm the artist.**

A real-time provenance platform that uses Hedera Consensus Service, Decentralized Identifiers, and Verifiable Credentials to create immutable proof of human creative authority in AI-assisted music production.

---

## 🎵 See It Live

| View | What It Shows |
|------|--------------|
| **[Album Experience](viewer/album.html)** | "Let's Stay This Way" — 12 tracks, cinematic dark design, provenance stories pulled live from Hedera |
| **[Topic Explorer](viewer/explorer.html)** | Browse any Hedera topic — decode messages, view DIDs, VCs, contributions |
| **[HashScan](https://hashscan.io/testnet/topic/0.0.7930484)** | Raw on-chain data for the album topic |

Open `viewer/album.html` or `viewer/explorer.html` directly in your browser — no server needed. They fetch live from the Hedera mirror node.

### Quick Links (paste into the explorer)

| What | Topic ID |
|------|----------|
| 📀 Album: "Let's Stay This Way" | `0.0.7930484` |
| 🎵 Track 1: Screwed | `0.0.7930486` |
| 🎵 Track 3: Ciudad (AI-authored) | `0.0.7930493` |
| 🎵 Track 6: Already True (100% human) | `0.0.7930499` |
| 🎤 Jon Bon Buckle (artist identity) | `0.0.7928916` |
| 🌮 Tacos at 3am (first demo) | `0.0.7928902` |
| 🛡️ Sentinel DID (platform identity) | `0.0.7929544` |

---

## The Problem

When an artist uses AI to make music, nobody can tell if they directed a creative process or just pressed a button. Distributors are rejecting AI-assisted music because there's no standard for proving human involvement.

We don't try to prove the output is "human enough." We prove the **process** was human-driven.

## The Architecture: Five Layers of Trust

| Layer | What It Does | Implementation |
|-------|-------------|----------------|
| **Primitives** | Define what can exist | HCS topics, SHA-256 hashes, DID strings |
| **Ontology** | Define how things connect | Artists→DIDs, Songs→Topics, Contributions→Messages |
| **Assertions** | Define what happened | W3C Verifiable Credentials, signed claims |
| **Sentinels** | Define who gets to say so | Platform DID co-signs every credential |
| **State** | What we compute from truth | Provenance chains, ownership splits, verification |

## What's Built

- **Artist DIDs** — Decentralized identifiers on Hedera for every creator
- **Contribution logging** — Every creative decision timestamped on HCS
- **Sentinel DID** — Platform identity that co-signs every credential (the notary)
- **W3C Verifiable Credentials** — Dual-signed provenance certificates
- **Collaborative ownership** — Multi-party VCs with ownership splits (must sum to 100%)
- **Trust revocation** — On-chain RevocationNotice, immutable audit trail
- **Verification endpoint** — Checks structure, signatures, shares, sentinel attestation
- **Provenance packages** — JSON + HTML certificate with SHA-256 hash stamping
- **Album replay** — 12 tracks, 77 contributions, 4 VCs on Hedera testnet

## Cost Model

| Scenario | Cost |
|----------|------|
| Single song (solo artist) | ~$0.03 |
| Single song (3 collaborators) | ~$0.05 |
| Full album (12 tracks, 4 artists, 4 VCs) | ~$0.26 |
| Song → provenance → NFT with royalties | ~$0.09 |
| Indie label (50 songs/year) | ~$1.58 |

## Stack

```
Browser → Rails App (port 3334) → Node.js Hedera Service (port 3335) → Hedera Testnet
```

- **Rails 8** — Application framework
- **Node.js/Express** — Hedera service (DIDs, VCs, HCS)
- **@hashgraph/sdk** — Hedera SDK
- **@hiero-did-sdk** — DID creation and resolution
- **PostgreSQL** — Data layer
- **Hedera Consensus Service** — Immutable provenance chain
- **Hedera Token Service** — Provenance-backed NFTs (planned)

## Documentation

| Document | Description |
|----------|------------|
| [WHITEPAPER.md](docs/WHITEPAPER.md) | Plain-language guide (~3,500 words) — start here |
| [THESIS.md](docs/THESIS.md) | Five-layer trust architecture (~2,800 words) |
| [DIAGRAMS.md](docs/DIAGRAMS.md) | 10 Mermaid diagrams (use cases, sequences, architecture) |
| [JACK.md](docs/JACK.md) | Team lead onboarding doc |

## Test Results

6 trust scenarios passing on live Hedera testnet:

1. ✅ **Solo Artist Lifecycle** — DID → contributions → VC → verification
2. ✅ **Collaborative Split** — Two artists, 60/40 ownership, dual-signed VC
3. ✅ **Invalid Split Rejection** — 110%, 90%, 0% all rejected
4. ✅ **Trust Revocation** — VC issued then revoked, immutable audit trail
5. ✅ **Sentinel Authority** — Tampered VCs fail, missing sentinel fails
6. ✅ **Artist Identity Provenance** — Creative DNA on-chain

Run them: `cd hedera && node test-scenarios.js` (server must be running)

## Setup

```bash
# Prerequisites: Ruby 4.0.1 (via mise), PostgreSQL, Node.js 20+

# 1. Start the Hedera service
cd hedera
npm install
node server.js        # port 3335

# 2. Start the Rails app (separate terminal)
cd ../platform
export PATH="/Users/dimension/.local/share/mise/installs/ruby/4.0.1/bin:$PATH"
bundle install
bin/rails db:create db:migrate
bin/rails server -p 3334

# 3. Open the viewers (no server needed)
open viewer/album.html       # album experience
open viewer/explorer.html    # topic explorer
```

## Team

- **Jack Highman** — Team Lead (UCF, IT Major)
- **Jeff Highman** — Technical Advisor
- **Jon** — Domain Expert (President, Local Records USA)

## Hackathon

**Hedera Hello Future: Apex Hackathon 2026** — AI & Agents Track
- $250K prize pool
- Submissions: Feb 17 – Mar 23, 2026
- [hackathon.stackup.dev](https://hackathon.stackup.dev/web/events/hedera-hello-future-apex-hackathon-2026)

---

*Every decision on Hedera is immutable. [Look it up yourself.](https://hashscan.io/testnet/topic/0.0.7930484) That's the point — you don't have to trust us.*
