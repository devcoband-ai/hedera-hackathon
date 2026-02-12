# Provenance as a Service

**AI made the music. The blockchain proves I'm the artist.**

## The Problem

Distributors are rejecting AI-assisted music. They want proof of human involvement, but no standard exists. The burden of proof has flipped: it's no longer "prove someone copied you" — it's "prove you actually created it."

## The Solution

A real-time provenance platform that uses Hedera Consensus Service to create immutable proof of human creative involvement in AI-assisted content creation.

Every creative decision — the prompt, the lyric edit, the rejection, the final pick — is a timestamped, immutable message on a Hedera topic. The result: a provenance record that proves human artistry.

## Three Layers of Innovation

1. **Creator's Dilemma** — Prove human involvement in AI-assisted content creation
2. **Multimodal Provenance** — One creative work, many outputs (music, lyrics, art, video), one unified chain
3. **Collaborative Consensus** — Multiple creators assert contributions to the same work with on-chain agreement

## Stack

- **Hedera Consensus Service** — Immutable provenance chain
- **Hedera Token Service** — Provenance certificate NFTs (stretch)
- **Suno** — AI music generation
- **Claude (DevCo)** — Platform intelligence
- **Rails 8** — Application framework
- **PostgreSQL** — Data layer

## Team

- **Jack Highman** — Team Lead (UCF, IT Major)
- **Jeff Highman** — Technical Advisor (CTO, author of "Tokenize the World")
- **Jon** — Domain Expert (President, Local Records USA)

## Hackathon

Hedera Hello Future: Apex Hackathon 2026 — AI & Agents Track

## Setup

```bash
# Prerequisites: Ruby 4.0.1, PostgreSQL, Node.js

# Install dependencies
bundle install

# Create and migrate database
rails db:create db:migrate

# Start the server
rails server -p 3334
```

## Status

🚧 Active development — Hackathon submission deadline March 23, 2026
