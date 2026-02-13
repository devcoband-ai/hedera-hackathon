# Provenance as a Service: How It Works

*A plain-language guide for the team*

---

## The Problem in One Sentence

When you create something with AI, nobody can tell if you're an artist who used a tool or a button-presser who got lucky.

## Why It Matters Right Now

Spotify, Apple Music, and other distributors are rejecting AI-assisted music. They want proof that a human was involved in the creative process. But there's no standard for proving it. The industry is making it up as they go — "75% human" rules that nobody can measure.

This isn't just a music problem. It applies to cover art, writing, video — anything where AI helped make the thing.

## Our Solution: Prove the Process

We don't try to prove the output is "human enough." We prove the **process** was human-driven.

Every creative decision gets recorded on a public, immutable ledger (Hedera). The decisions tell the story:

- "I wrote this prompt"
- "The AI gave me this back"
- "I rejected it because the chorus was weak"
- "I refined the prompt"
- "I picked the final version"

That chain of decisions **is** the proof. The iteration is the human contribution.

## How Hedera Works (The Simple Version)

Think of Hedera like a public notebook that nobody can erase.

**Topics** — Each song (or artist, or album) gets its own page in the notebook. This is called a "topic." It has an ID like `0.0.7928902`.

**Messages** — Every time something happens (a prompt is written, a track is generated, a decision is made), we write a message on that page. Messages are numbered in order (#1, #2, #3...) and timestamped by the network — not by us, by Hedera's consensus.

**Immutability** — Once a message is written, it cannot be edited or deleted. Ever. By anyone. That's the whole point.

**Public verification** — Anyone can look up a topic on [HashScan](https://hashscan.io) and see every message. A distributor doesn't have to trust us — they can verify independently.

**Cost** — Creating a topic costs $0.01. Each message costs $0.0008. A full song's provenance chain (30 creative decisions) costs about three cents.

## The Crypto Link (How We Tie Files to the Chain)

When we generate an image or audio file, we can't put the whole file on Hedera (too big, too expensive). Instead, we create a **fingerprint**.

**SHA-256 hash** — This is a math function that takes any file and produces a unique 64-character code. Like a fingerprint for data.

The cover art we generated has this fingerprint:
```
31da0bc34587612f95b8ddfa0b36fd0d5f4b7a66b1603d9b3a8262d1150290da
```

That fingerprint is stored on Hedera. If you take the image file and run the same math, you get the same fingerprint. If even one pixel changes, the fingerprint completely changes.

**Verification:**
1. Take the file
2. Run `shasum -a 256 filename.png`
3. Compare the result to what's on Hedera
4. Match = original, untampered file
5. No match = something changed

## Three Layers of What We're Building

### Layer 1: Song Provenance
Every song gets a Hedera topic. Every creative decision — prompts, generations, rejections, edits, selections — gets logged as a message. The result is an immutable record of how the song was made.

**Example:** "Tacos at 3am" has 6 contributions on topic `0.0.7928902`:
1. Jeff wrote the prompt
2. Suno generated a draft
3. Jeff rejected it
4. Jeff refined the prompt
5. Suno generated v2
6. Jeff selected the final

A distributor sees: this wasn't one-click AI. This was a human directing a creative process through multiple iterations.

### Layer 2: Multimodal Provenance
A song isn't just audio. It's lyrics, cover art, video, social content. Each creative artifact gets its own provenance trail, all linked back to the same work.

**Example:** Jon Bon Buckle's cover art has its own provenance — the prompt he directed, the AI tool that generated it, the SHA-256 hash of the output. All on his artist topic.

### Layer 3: Artist Identity & Collaborative Provenance
Artists themselves have topics. Jon Bon Buckle registered his artistic lineage (Art Chantry, Warhol, Carson, Brutalism) and creative manifesto on Hedera. This is his on-chain creative DNA.

When multiple people work on a song — a lyricist, a producer, an AI tool — each contribution is logged by the person who made it. The provenance chain shows who did what, when, in what order. Credit isn't negotiated after the fact — it's proven in real-time.

## What We Built So Far

| Thing | Status | Hedera Topic |
|-------|--------|-------------|
| Platform (Provenance Studio) | Running on localhost:3334 | — |
| Hedera service (Node.js) | Running on localhost:3335 | — |
| "Tacos at 3am" song | 6 contributions on-chain | [0.0.7928902](https://hashscan.io/testnet/topic/0.0.7928902) |
| Jon Bon Buckle artist profile | Registration + lineage + manifesto + cover art | [0.0.7928916](https://hashscan.io/testnet/topic/0.0.7928916) |
| Cover art (Gemini 3 Pro) | Generated, SHA-256 hashed, stamped on-chain | See topic above, msg #4-5 |

## The AI Stack

- **Suno** — Music generation
- **Gemini 3 Pro** — Image generation (cover art)
- **Claude** — Platform intelligence, workflow orchestration
- **Grok** — Promotional content (TBD)
- **Hedera Consensus Service** — The immutable ledger tying it all together

## The Tagline

**"AI made the music. The blockchain proves I'm the artist."**

## What's Next

1. **Register for the hackathon** — Hedera Hello Future Apex, AI & Agents track, $250K prize pool
2. **Build the demo flow** — End-to-end: create song → iterate → stamp → export provenance certificate
3. **Record demo video** — Jon walks judges through the product
4. **Submit by March 23**

---

*Questions? Look up any topic ID on [hashscan.io/testnet](https://hashscan.io/testnet) and see for yourself. That's the point — you don't have to trust us.*
