# Hedera Apex Hackathon — Game Plan

## The Contest
**Hello Future: Apex** — the finale of Hedera's $550K hackathon trilogy. This round: **$250K in prizes**.

### Target Track: **AI & Agents**
> "Autonomous systems, AI copilots, and intelligent on-chain applications"

This is our lane. Every other track is finance or sustainability. We're the only ones bringing **music + AI + provenance**.

### What Judges Want
1. **Real Hedera utility** — not just "we stored a hash." Deep use of Consensus Service, Token Service, or both.
2. **AI integration** — it's in the track name. The more AI services woven in, the better.
3. **Real-world problem** — not theoretical. Solving something that exists today.
4. **Working demo** — past winners shipped working products, not slide decks.
5. **Cool factor** — Effisend won with "pay with your face." We win with "prove you're an artist."

### Past Winner Patterns
- KeyRing: governance + real-time dashboards + threshold accounts
- Aslan: autonomous agents + x402 payments + smart contracts
- Effisend: biometric payments (returned for Legacy track and placed again)

**The bar is high. But nobody's done creative provenance.**

---

## Our Entry: Provenance as a Service (PaaS)

**Tagline:** "AI made the music. The blockchain proves I'm the artist."

### The Problem
Spotify, Apple Music, and distributors are rejecting AI-generated music. They want proof of human involvement. The "75% human" rule is arbitrary and unmeasurable. There's no standard for proving the difference between one-shot AI generation and AI-assisted human creation.

### The Solution
A real-time provenance chain using Hedera Consensus Service that captures every creative decision in the music production process.

### How It Works

```
[Suno AI] → generates track
    ↓
[DevCo Platform] → logs prompt, parameters, iteration
    ↓
[Hedera Consensus Service] → immutable timestamped message on song topic
    ↓
[Human Decision] → "no, not that" / "change the bridge" / "more cowbell"
    ↓
[DevCo Platform] → logs rejection + new direction
    ↓
[Hedera] → another consensus message
    ↓
... iterate ...
    ↓
[Final Selection] → human picks the winner
    ↓
[Hedera] → final consensus message + provenance record minted
    ↓
[Export] → Provenance certificate for distributor submission
```

### Hedera Services Used
1. **Consensus Service** — Create a topic per song. Every creative iteration = a message. Immutable, ordered, timestamped.
2. **Token Service** (stretch) — Mint a provenance NFT for the finished track. The NFT links to the consensus topic = full audit trail.

### AI Stack
- **Suno** — Music generation (the AI creative engine)
- **Claude / DevCo** — Platform intelligence, workflow orchestration, creative assistant
- **Grok** — Promotional content generation, social marketing (TBD)

### Demo Flow (5 minutes)
1. **Open DevCo Platform** — show the music provenance dashboard
2. **Create a new song** — "Let's write a dumb song about tacos"
3. **Generate with Suno** — first iteration appears, logged to Hedera in real-time
4. **Reject it** — "Too slow, need more energy" → logged
5. **Iterate 2-3 times** — each decision timestamped on Hedera
6. **Pick the winner** — final track selected, provenance record sealed
7. **Show the Hedera topic** — immutable proof of every decision
8. **Export provenance certificate** — "This is what you send to Spotify"
9. **Bonus: Show the DAG** — visual representation of the creative journey

### Why We Win

| Factor | Our Advantage |
|--------|---------------|
| **Real problem** | Distributors are actively blocking AI music. This solves it today. |
| **AI depth** | Three AI services (Suno + Claude + Grok), not just one |
| **Hedera utility** | Deep Consensus Service use — not just storing a hash, using topics as living audit trails |
| **Cool factor** | Live music generation + blockchain in real-time. Judges hear a song being born. |
| **Working product** | DevCo Platform already exists. Music provenance module already designed. We're extending, not starting from scratch. |
| **Story** | Father-son team. Real musicians. Actually use Suno. Not crypto bros cosplaying creativity. |
| **Nobody else is doing this** | Search "music provenance blockchain" — it's all vaporware whitepapers. We ship. |

---

## Execution Plan

### Week 1: Foundation
- [ ] Hedera SDK setup (JavaScript/Node.js or Java)
- [ ] Create topic programmatically
- [ ] Submit messages to topic
- [ ] Read topic messages back
- [ ] Basic integration with DevCo Platform (API endpoint)

### Week 2: Music Pipeline
- [ ] Suno API integration (or manual workflow with logging)
- [ ] Song model → Hedera topic mapping
- [ ] Contribution logging (prompt, edit, rejection, selection)
- [ ] Real-time consensus message submission on each creative event

### Week 3: Provenance Record
- [ ] Provenance certificate generation (PDF + on-chain reference)
- [ ] DAG visualization of creative journey
- [ ] Export format for distributor submission
- [ ] Optional: HTS NFT minting for finished tracks

### Week 4: Polish & Demo
- [ ] Demo script rehearsal
- [ ] Video recording (if required)
- [ ] README, docs, architecture diagram
- [ ] Submission

---

## Tech Decisions

### Hedera SDK
- **JavaScript SDK** — fastest path, Jack knows JS
- Mirror Node API for reading back consensus data
- Testnet for development, mainnet optional for demo impact

### Architecture
```
DevCo Platform (Rails) 
  → Hedera Service (Node.js microservice)
    → Hedera Consensus Service (topics + messages)
    → Hedera Token Service (optional NFT minting)
  → Suno API (music generation)
  → Provenance Certificate Generator
```

### Key Hedera Concepts
- **Topic** = one per song (the provenance chain)
- **Message** = one per creative event (the assertion)
- **Sequence number** = ordering (the timeline)
- **Timestamp** = consensus time (the proof)

This maps directly to the Tokenize the World ontology:
- Topic = Entity (the song)
- Message = Assertion (what happened)
- Timestamp = Consensus (when it was agreed)
- The chain = Provenance (the full story)

---

## The Team

**Jack Highman** — Team Lead
- Junior at UCF, IT major
- Vision holder — saw the provenance gap and proposed the solution
- Building the Hedera integration (JavaScript SDK)

**Jeff Highman** — Technical Advisor
- CTO, 30 years in enterprise tech
- Built the platform infrastructure
- Author of "Tokenize the World" (ontology that maps to HCS)

**Jon** — Domain Expert & Demo Presenter
- President, Local Records USA (real music label)
- Living the distributor gatekeeping problem daily
- User for multimodal (Layer 2) and collaborative (Layer 3) demos
- Recording the demo video — the label president walks judges through the product

**Roles:**
- Jack: vision + Hedera SDK integration
- Jeff: platform engineering + architecture
- Jon: domain expertise + demo + business validation

## Registration
- Platform: https://hackathon.stackup.dev/web/events/hedera-hello-future-apex-hackathon-2026
- Beginner-friendly, global
- Track: AI & Agents
