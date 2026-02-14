# Provenance as a Service: How It Works

*A plain-language guide for the team — updated February 2025*

---

## The Problem in One Sentence

When you create something with AI, nobody can tell if you're an artist who used a tool or a button-presser who got lucky.

## Why It Matters Right Now

Spotify, Apple Music, and other distributors are rejecting AI-assisted music. They want proof that a human was involved in the creative process. But there's no standard for proving it. The industry is making it up as they go — "75% human" rules that nobody can measure.

And it's not just about proving you made it. It's about proving *who* you are, *what* you made, *who helped*, and *what rights you each have*. Right now, none of that is standardized. Contracts are PDFs. Credits are honor-system. Splits are negotiated in group texts.

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

But we go further. Every artist gets a **decentralized identity** — a cryptographic passport that lives on Hedera. When the creative process is complete, we issue a **verifiable credential** — a tamper-proof certificate that says "this person made this thing, here's the proof, and here's who co-signed it." The credential is signed by both the artist and the platform, so it's not just a claim — it's an attested fact.

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

## Decentralized Identity (DIDs)

Here's a question: how do you prove *who* made the music?

You could use a username. But usernames belong to platforms — Spotify can change yours, SoundCloud can delete it, and two different services can have two different "DJ Shadow" accounts. Your identity is rented, not owned.

A **Decentralized Identifier (DID)** is different. It's a permanent, cryptographic identity that lives on Hedera. Nobody controls it but you. It looks like this:

```
did:hedera:testnet:z6Mkr...xyz_0.0.7930260
```

That's DJ Quantum's identity. The long string is derived from their cryptographic key (like a signature that only they can produce), and the topic ID is where their identity document lives on Hedera.

Think of it like a passport that:
- Nobody can forge (it's cryptographic)
- Nobody can revoke without a public record
- Works across any platform that speaks the standard
- You carry with you, not locked to one service

When an artist registers with our platform, we create their DID automatically. From that point on, everything they do — every song, every collaboration, every creative decision — is tied back to that identity. Not to a username. Not to an email. To a cryptographic proof that they are who they say they are.

## Verifiable Credentials

Once the creative process is complete, we need to package it up into something that anyone can check. That's what a **Verifiable Credential (VC)** does.

A VC is a digital certificate that follows the W3C standard — the same organization that standardizes the web itself. Our VC (we call it a `ProvenanceCredential`) says:

- **Who** made it (the artist's DID)
- **What** they made (the song, linked to its Hedera topic)
- **How** they made it (the full provenance chain of creative decisions)
- **When** it was certified
- **Who witnessed it** (the platform's sentinel DID — more on that below)

Think of it like a diploma. The diploma says "Jane Smith completed a degree in Music Production." It's signed by both the student (they accept it) and the university (they attest to it). If only Jane signed it, it would just be a claim. The university's signature is what makes it credible.

Our VCs work the same way. They carry **dual proof** — signed by the artist AND by the platform. Two signatures, two keys, both verifiable by anyone.

Here's the key insight: the VC isn't stored in our database. It's written to Hedera. That means even if our platform disappears tomorrow, the credential still exists. It's permanent proof, independent of us.

## The Sentinel

**The problem without a sentinel:**

Jon mints an NFT and says "I made this song." You either believe him or you don't. He could have stolen it. He could have typed one word into Suno and called it art. You have no idea. His claim is just... his claim.

**The problem with self-attestation:**

Jon creates a credential that says "I wrote 6 prompts, rejected 3 drafts, and approved the final master." Okay — but he wrote that credential himself. It's like writing your own reference letter. The claims might be true, but there's no independent verification.

**What the Sentinel does:**

The Sentinel is the **notary**. It doesn't create music. It doesn't own anything. It watches the process and stamps its signature when the process was legit.

Think of it like a diploma. You can print a piece of paper that says "Harvard, Class of 2026." But without Harvard's signature on it, it's just paper. The university witnessed you doing the work — attending class, passing exams, writing the thesis. Their signature means "we watched this happen."

In our system:
- **The artist** is the student — they did the creative work
- **Provenance Studio** is the university — the Sentinel that watched them do it
- **The Verifiable Credential** is the diploma — signed by both parties
- **Hedera** is the filing cabinet nobody can break into

The Sentinel has its own DID (`did:hedera:testnet:..._{0.0.7929544}`), created automatically when the platform starts up. Every time an artist logs a contribution, the platform sees it. Every prompt, every rejection, every approval — the Sentinel is watching. When the artist requests a credential, the Sentinel checks: did I actually witness this workflow? If yes, it co-signs. If not, it refuses.

**Concretely, here's what the Sentinel saw when Jon made "Tacos at 3am":**

1. Jon wrote the prompt → Sentinel saw it enter the system
2. Suno generated a draft → Sentinel logged the AI output
3. Jon rejected it ("chorus was weak") → Sentinel recorded the human decision
4. Jon refined the prompt → Sentinel recorded the iteration
5. Suno generated v2 → Sentinel logged the new output
6. Jon approved the final → Sentinel recorded the approval

Six decisions. All witnessed. When the credential is issued, the Sentinel's co-signature says: "I watched all six of these happen, in this order, at these times. This is real."

Without the Sentinel's signature, our verification endpoint rejects the credential. Period. You can't self-issue a valid provenance credential any more than you can self-issue a valid diploma. The witness matters.

## Collaborative Ownership

Music is rarely made alone. A producer lays the beat. A vocalist writes the melody. A lyricist adds the words. An engineer mixes it. How do you capture all of that?

With our system, each creator has their own DID. When they collaborate on a song, the resulting Verifiable Credential includes a **creators array** — a list of every contributor, their DID, their role, and their ownership share.

```
creators: [
  { did: "did:hedera:testnet:...marcus", role: "producer", share: 60 },
  { did: "did:hedera:testnet:...aria",   role: "vocalist", share: 40 }
]
```

The shares must total exactly 100%. If they don't, the credential won't pass verification. No rounding errors, no ambiguity.

Here's what makes this powerful: **the VC is the agreement**. It's not a PDF contract that someone has to interpret. It's not a verbal deal. It's a cryptographically signed, on-chain document that both parties (and the Sentinel) attested to. The splits are baked into the proof itself.

In our tests, Marcus Cole (producer, 60%) and Aria Chen (vocalist, 40%) collaborated on "Neon Heartbeat." Their credential lives on topic `0.0.7930253`. Anyone can look it up. The ownership split is right there — signed by both artists and the Sentinel. No lawyers needed.

## Trust Revocation

What happens when a collaboration goes bad? What if someone's contribution turns out to be plagiarized? What if a credit was assigned incorrectly?

You can't delete from Hedera. That's the point — immutability protects the honest record. But you can **revoke** a credential.

Revocation works by adding a new message — a `RevocationNotice` — to the chain. It doesn't erase the original credential. Instead, it says: "This credential, issued at this time, is no longer valid. Here's why."

The full history stays intact: issuance AND revocation. This is an **immutable audit trail**. Anyone verifying the credential sees:

1. The original credential was issued ✓
2. A revocation notice was filed ✓
3. The reason for revocation ✓
4. When the revocation happened ✓

This is actually better than deletion. If you could delete, there'd be no record that the credential ever existed. With revocation, there's a complete, transparent history. The truth isn't hidden — it's annotated.

In our Ghost Producer test, we issued a credential and then revoked it. Both events are visible on topic `0.0.7930257`. The system correctly rejects the credential as revoked during verification.

## The Five Layers

Our architecture has five layers, each building on the one below:

### Layer 1: Primitives
The raw building blocks. Hedera topics, SHA-256 hashes, DIDs. These are the atoms — they don't mean anything by themselves, but everything is built from them. A topic is just a page. A hash is just a fingerprint. A DID is just an identity. Meaning comes from how you combine them.

### Layer 2: Ontology
How the primitives connect. An artist DID *owns* a song topic. A song topic *contains* contribution messages. A contribution *references* a file hash. This layer defines the relationships — the grammar that makes the atoms into sentences.

### Layer 3: Assertions
Claims about the world, backed by evidence. "Luna Vega created Midnight Algorithm." "Marcus Cole owns 60% of Neon Heartbeat." These are Verifiable Credentials — structured, signed, and anchored to the provenance chain. They're not opinions; they're assertions with proof attached.

### Layer 4: Sentinels
Who gets to make those assertions? Not just anyone. The Sentinel layer defines authority. Our platform Sentinel co-signs every credential, attesting that the workflow was genuine. Future sentinels could include distributors, labels, or DAOs — each adding their own attestation. The more sentinels who vouch for a credential, the stronger its trust score.

### Layer 5: State
The computed truth. Given all the primitives, relationships, assertions, and attestations — what's the current state of the world? Is this credential valid or revoked? Who owns what share? Is this artist who they claim to be? State is derived, not stored. It's the answer you get when you ask the system a question.

## What We Built

| Thing | Status | Hedera Topic |
|-------|--------|-------------|
| Platform (Provenance Studio) | Running on localhost:3334 | — |
| Hedera service (Node.js) | Running on localhost:3335 | — |
| Sentinel DID | Auto-created on startup, co-signs all VCs | [0.0.7929544](https://hashscan.io/testnet/topic/0.0.7929544) |
| "Tacos at 3am" song | 6 contributions on-chain | [0.0.7928902](https://hashscan.io/testnet/topic/0.0.7928902) |
| Jon Bon Buckle artist profile | Registration + lineage + manifesto + cover art | [0.0.7928916](https://hashscan.io/testnet/topic/0.0.7928916) |
| Luna Vega — "Midnight Algorithm" | Solo artist lifecycle, DID + VC issued | [0.0.7930243](https://hashscan.io/testnet/topic/0.0.7930243) |
| Marcus Cole + Aria Chen — "Neon Heartbeat" | Collaborative VC, 60/40 split | [0.0.7930253](https://hashscan.io/testnet/topic/0.0.7930253) |
| Ghost Producer — revocation demo | Credential issued then revoked | [0.0.7930257](https://hashscan.io/testnet/topic/0.0.7930257) |
| DJ Quantum — artist identity | DID creation and verification | [0.0.7930260](https://hashscan.io/testnet/topic/0.0.7930260) |
| Cover art (Gemini 3 Pro) | Generated, SHA-256 hashed, stamped on-chain | See Jon Bon Buckle topic |
| DID creation & resolution | Working on live testnet | — |
| Verifiable Credential issuance | W3C-compliant ProvenanceCredential | — |
| Dual-proof signatures | Artist + Sentinel co-sign every VC | — |
| Collaborative ownership splits | Multi-party VCs, shares must sum to 100% | — |
| Trust revocation | RevocationNotice on-chain, immutable audit trail | — |
| Verification endpoint | Validates structure, signatures, shares, sentinel | — |

## Test Results

This isn't theoretical. We ran six test scenarios on the live Hedera testnet, and all six passed.

**1. Solo Artist Lifecycle** — Luna Vega creates a DID, produces "Midnight Algorithm," receives a ProvenanceCredential signed by both her key and the Sentinel. Credential passes verification. ✅

**2. Collaborative Splits** — Marcus Cole (producer, 60%) and Aria Chen (vocalist, 40%) collaborate on "Neon Heartbeat." The VC includes both creators with their DIDs and shares. Shares sum to 100%. Credential passes verification. ✅

**3. Invalid Credential Rejection** — A malformed credential (bad structure, wrong shares, missing fields) is submitted for verification. The system correctly rejects it with specific error messages. ✅

**4. Trust Revocation** — Ghost Producer receives a credential, then it's revoked with a RevocationNotice. Verification correctly identifies the credential as revoked. Full audit trail preserved on-chain. ✅

**5. Sentinel Authority** — A credential without the Sentinel's co-signature is submitted. Verification rejects it — proving that self-issued credentials aren't valid without platform attestation. ✅

**6. Artist Identity** — DJ Quantum creates a DID, and the system resolves it back to their public key and topic. Identity is persistent and verifiable. ✅

Every one of these tests wrote real data to the Hedera testnet. Every topic ID above is live — you can look them up on [HashScan](https://hashscan.io/testnet) right now and see the messages yourself.

## The AI Stack

- **Suno** — Music generation
- **Gemini 3 Pro** — Image generation (cover art)
- **Claude** — Platform intelligence, workflow orchestration
- **Grok** — Promotional content (TBD)
- **Hedera Consensus Service** — The immutable ledger tying it all together

## Provenance-Backed NFTs

Everything we've built leads to a natural next step: **minting NFTs that carry their provenance with them.**

The music NFT space right now is broken. You mint a token, attach a JPEG, and... that's it. No proof of how the music was made, who contributed, or whether the minter had any creative involvement. It's a receipt for nothing.

We flip that. The NFT doesn't just represent the song — it **points back to the entire provenance chain.**

Here's how it works:

1. Artist creates song → full provenance chain on HCS ✅ (built)
2. Collaborative VC issued with ownership splits ✅ (built)
3. Sentinel co-signs the credential ✅ (built)
4. **Mint an NFT on Hedera Token Service (HTS)** that references the VC
5. The NFT's metadata contains: the VC ID, the provenance topic ID, the master hash of the work
6. Anyone holding the NFT can trace it back to every creative decision that made the song

### What This Unlocks

**Royalty splits baked in.** Hedera Token Service supports custom royalty fees per account — no smart contract needed. The VC's creators array (60/40, 50/25/25, whatever) maps directly to on-chain royalty distribution. When the NFT trades, royalties flow automatically to every contributor based on the splits defined in the credential.

**Provenance as value.** An NFT backed by 77 documented creative decisions is worth more than one with no history. The chain of custody IS the collectible. Collectors aren't just buying a song — they're buying the story of how it was made.

**Fractional ownership.** The creators array already defines shares. Multiple NFTs, one per collaborator, each backed by the same VC. Ownership is cryptographically defined, not contractually negotiated.

**Secondary market trust.** A buyer can verify the full provenance chain before purchasing. No fake provenance. No stolen work minted as someone else's. The sentinel's co-signature means the platform witnessed the creation process.

### The Economics

| Action | Cost |
|--------|------|
| Full song provenance (creation → approval) | ~$0.03 |
| Collaborative VC with splits | ~$0.01 |
| Mint NFT on HTS | ~$0.05 |
| Custom royalty fee setup | included in mint |
| **Total: song creation → provenance → NFT with royalties** | **~$0.09** |

Compare that to minting on Ethereum ($5-50 in gas) or the legal cost of a single royalty dispute ($10,000+). Hedera makes provenance-backed NFTs economically viable for every song, not just hits.

### The Bigger Picture

This isn't just about music NFTs. Any creative work with AI involvement — cover art, writing, video, design — can follow the same path: prove the process, issue the credential, mint the token. The provenance travels with the asset forever.

The NFT becomes proof of *how* something was made, not just *that* it exists.

## The Sentinel Network & Licensing Marketplace

We started with one sentinel. But the architecture supports many.

Think about what happens after creation. A film producer wants to license the song. A distributor picks it up. A label signs the artist. Each is a **different trust domain** with a **different sentinel** watching:

- **Creation Sentinel** (Provenance Studio) — "I watched the artist make this"
- **Marketplace Sentinel** — "I processed the licensing transaction"
- **Distribution Sentinel** — "This work meets our content requirements"
- **Label Sentinel** — "This artist is on our roster"

A song accumulates sentinel attestations as it moves through the world. More sentinels = more trust.

### Licensing Through Staking

Here's where it gets interesting. Today, licensing a song requires discovery, negotiation, contracts, payment processing, rights clearance. Multiple parties, multiple documents, weeks of back-and-forth.

In a sentinel-networked marketplace, it's one transaction:

1. Licensee finds the song, reads the VC — creators, splits, sentinel-verified
2. Licensee **stakes HBAR** on the song's topic — the stake IS the license fee
3. Hedera auto-distributes per the creators array (50% to Jeff, 25% to Sam, 25% to Jon)
4. Marketplace sentinel takes 2-3% and co-signs a **License VC**
5. License recorded on-chain — done

Three things collapse into one: **discovery, agreement, and payment.** No lawyers. No contracts. The VC says who gets paid. The stake is the deal. The sentinel witnesses it.

And here's the kicker: **provenance makes licenses more valuable.** A song with 77 documented decisions and a sentinel co-signature gives the licensee legal cover. If anyone challenges the use, the provenance chain IS the defense. More provenance → safer license → higher stakes → more revenue. The economics reward documenting your creative process.

## What's Next

1. **Hackathon submission** — Hedera Hello Future Apex, AI & Agents track, $250K prize pool, deadline March 23
2. **NFT minting** — Integrate Hedera Token Service to mint provenance-backed NFTs from verified credentials
3. **Sentinel network** — Multiple sentinel types for licensing, distribution, and rights clearance
4. **Staking marketplace** — License music through HBAR staking with auto-distribution
5. **Demo video** — Jon walks judges through the full flow
6. **Production deployment** — Move from testnet to mainnet

## The Tagline

**"AI made the music. The blockchain proves I'm the artist."**

---

*Questions? Look up any topic ID on [hashscan.io/testnet](https://hashscan.io/testnet) and see for yourself. That's the point — you don't have to trust us.*
