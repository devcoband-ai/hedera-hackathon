# Provenance as a Service: A Five-Layer Trust Architecture for AI-Assisted Creative Work

## Abstract

We built a provenance system for AI-assisted music creation on Hedera Consensus Service, and in the process, we discovered something uncomfortable: the trust crisis everyone blames on AI was always there. We just didn't care enough to fix it. This thesis presents a five-layer trust architecture — Primitives, Ontology, Assertions, Sentinels, and State — that transforms creative provenance from a social convention into a cryptographic fact. Using Hedera's consensus layer, we implemented decentralized identifiers for artists, immutable contribution logging, W3C Verifiable Credentials with dual-proof signatures, and a sentinel co-signing model that elevates platform attestation beyond self-reported claims. The result is a system where every creative decision is timestamped, every ownership split is encoded in the credential itself, and every provenance claim can be independently verified. The architecture is domain-agnostic: it works for music today and for any collaborative creative process tomorrow. AI made the music. The blockchain proves I'm the artist. The sentinel confirms the process was real.

---

## 1. The Problem

Here's a dirty secret the music industry doesn't like to talk about: we've been losing track of who made what for decades.

Before AI entered the picture, the metadata crisis was already catastrophic. Something like 25% of streaming royalties go unpaid or mispaid because nobody can definitively prove who contributed what to a recording. Songwriters get lost in the shuffle. Producers go uncredited. Session musicians vanish from the record entirely. We built a multi-billion dollar industry on top of a system where provenance — the fundamental question of "who did this?" — was handled by spreadsheets, emails, and gentleman's agreements.

Then AI showed up and broke the one assumption holding the whole thing together: that creation implies a creator.

When a human writes a melody, there's a person at the other end of the pen. You might lose track of them, but they exist. When an AI generates a melody from a prompt, the relationship between creation and creator becomes genuinely ambiguous. Who's the author? The person who typed the prompt? The team that trained the model? The artists whose work became training data? The answer matters for copyright, for royalties, for credit — and we have no infrastructure to resolve it.

The industry's response has been predictably reactive. Ban AI. Watermark AI outputs. Sue the model providers. These are all responses to a symptom. The disease is that we never built trust infrastructure for creative work in the first place. AI didn't create the problem. It made the problem impossible to ignore.

What we need isn't a way to detect AI. We need a way to prove human creative authority — cryptographically, immutably, and in real time.

---

## 2. The Architecture

Over several years of thinking about trust systems, we developed a five-layer model for how trust actually works in digital environments. Not how we wish it worked. Not how whitepapers describe it. How it actually functions when you peel back the abstractions and look at the primitives.

The five layers build on each other. Skip one and the whole thing collapses.

### Layer 1: Primitives — What Can Exist

Every trust system starts with its atoms. What are the irreducible building blocks that everything else is made from?

In our system, the primitives are:

- **HCS Topics** — Hedera Consensus Service topics that serve as append-only logs. Each artist gets one. Each song gets one. They're cheap ($0.01 to create) and permanent.
- **SHA-256 Hashes** — Cryptographic fingerprints of creative artifacts. A hash doesn't tell you what something is, but it proves that a specific thing existed at a specific time.
- **DID Strings** — Decentralized Identifiers in the format `did:hedera:testnet:{publicKey}_{topicId}`. These are self-sovereign identity anchors. No central authority issues them. No central authority can revoke them.

These primitives don't mean anything by themselves. A hash is just a number. A DID is just a string. A topic is just an empty log. Meaning comes from the next layer.

### Layer 2: Ontology — How Things Connect

Ontology defines the relationships between primitives. It's the grammar of the system — the rules for how atoms combine into molecules.

In our architecture:

- Artists have DIDs. A DID is an artist's cryptographic identity, anchored to a Hedera topic that becomes their permanent identity log.
- Songs have topics. Every creative work gets its own append-only history — a chain of contributions that tells the story of how the work came to be.
- Contributions link artists to songs. When an artist makes a creative decision — writes a lyric, adjusts a melody, approves an AI-generated arrangement — that decision is logged to the song's topic with the artist's DID attached.

The ontology is deliberately simple. Artists make contributions to songs. That's it. But that simplicity is the point. Complex systems fail at the edges. Simple ontologies scale.

### Layer 3: Assertions — What Happened

This is where claims enter the system. An assertion is a signed statement that something occurred: "I wrote these lyrics." "I directed this AI to generate this beat." "We agreed to split ownership 60/40."

We implement assertions as W3C Verifiable Credentials — specifically, a custom `ProvenanceCredential` type. Each VC contains:

- The creator(s) and their DIDs
- The creative work being claimed
- The nature of the contribution
- Ownership splits (for collaborative works)
- A SHA-256 hash of the artifact
- Timestamps from Hedera's consensus layer

The VC is signed by the artist's assertion method — their private key, linked to their DID. This proves the artist made the claim. But here's the thing: self-attestation is necessary but not sufficient. Anyone can claim anything. Which brings us to the most important layer.

### Layer 4: Sentinels — Who Gets to Say So

This is the key insight, and it's the one most provenance systems get wrong.

If I sign a credential saying "I wrote this song," all that proves is that I *claimed* to write the song. My signature authenticates the claim. It doesn't validate the process. In a world where I can prompt an AI to generate a complete track in thirty seconds, self-attestation is meaningless without corroboration.

Sentinels are trusted entities that witness and co-sign assertions. In our system, the platform itself acts as a sentinel. It has its own DID — a platform identity anchored on Hedera — and it co-signs every Verifiable Credential it processes.

The sentinel's signature means something different from the artist's signature:

- **The artist's signature** (via `assertionMethod`) says: "I made this claim."
- **The sentinel's signature** (via `authentication`) says: "I observed the process that led to this claim, and I attest that it was legitimate."

This is dual-proof signing. Two signatures, two purposes, one credential. The artist asserts. The sentinel attests. Together, they create a claim that's both authenticated and validated.

Why does this matter? Because in collaborative creative work — especially with AI — there needs to be a witness. When three artists and an AI model collaborate on a track, someone needs to confirm that the workflow happened as described. That the contributions were real. That the ownership splits were agreed upon by all parties. The sentinel is that witness.

We'll come back to this. It's the most important idea in the system.

### Layer 5: State — What We Compute from Truth

State is derived. It's what you get when you process the assertions through the ontology using the primitives. State is never stored as ground truth — it's always computed from the layers below.

In our system, state includes:

- **Provenance chains** — the complete, ordered history of a creative work, computed from HCS topic messages
- **Ownership splits** — who owns what percentage, derived from the collaborative VCs
- **Verification results** — the output of checking a credential against its signatures, its shares, and its sentinel attestation
- **Artist identity graphs** — a creator's full body of work, reconstructed from their DID's topic history. Creative DNA on-chain.

State is where the system becomes useful. You can query it. You can build UIs on top of it. You can feed it to royalty systems and rights management platforms. But its integrity depends entirely on the layers beneath it.

---

## 3. The Sentinel Principle

We need to spend more time here because this is what separates our approach from every other provenance system we've seen.

Most blockchain-based provenance solutions stop at self-attestation. They let creators sign claims about their work and timestamp those claims on-chain. That's Layer 3 — assertions — and it's valuable. But it's not enough.

Consider the scenario: an artist uses an AI tool to generate a complete musical arrangement. They then sign a Verifiable Credential claiming they "composed" the arrangement. The credential is valid. The signature checks out. The timestamp is immutable. And the claim is, at best, misleading.

Self-attestation tells you *who* made a claim. It doesn't tell you *whether the claim reflects reality*. For that, you need a witness.

The sentinel model introduces institutional attestation without institutional control. The platform doesn't own the artist's identity. It doesn't issue or revoke their DID. It doesn't control their keys. What it does is observe the creative process and co-sign the resulting credential if — and only if — the process was legitimate.

This matters enormously for collaborative work. When multiple artists contribute to a single track, the sentinel validates that all parties agreed to the ownership splits. The creators array in the VC lists every contributor with their DID and their share. The shares must sum to 100. The sentinel verifies this before co-signing. No disputes later about who agreed to what. The credential IS the agreement.

The sentinel principle also provides a natural escalation path. Today, the platform is the sentinel. Tomorrow, it could be a DAO, a guild, a union, a standards body. The architecture doesn't care who the sentinel is — it cares that the sentinel role exists and that its attestation is cryptographically distinct from the creator's assertion.

---

## 4. Collaborative Ownership

The music industry's collaboration problem is fundamentally a data structure problem. When three people make a song together, the question of "who owns what" is answered by a conversation, maybe a contract, often nothing at all. The answer lives in someone's memory, someone's email, someone's filing cabinet.

We replaced all of that with a data structure.

A collaborative Verifiable Credential in our system contains a `creators` array. Each entry includes an artist's DID and their ownership share. The shares must sum to exactly 100. The credential is signed by every participating artist and co-signed by the sentinel.

This means:

- **The split is encoded at creation time.** Not after the fact. Not when royalties arrive. At the moment the work is claimed.
- **Every party signs.** Multi-party VCs require all creators to assert their agreement. No one gets added or removed without a new credential.
- **The sentinel validates the math.** Shares that don't sum to 100 get rejected. This is enforced at the verification layer, not by policy.
- **The credential is the contract.** There's no separate agreement to reference. The VC itself is the cryptographic proof that these parties agreed to this split for this work at this time.

This isn't theoretical. We built it. The verification endpoint checks structure, validates signatures, confirms share arithmetic, and verifies sentinel attestation. If any of those checks fail, the credential is invalid.

---

## 5. What Hedera Enables

We chose Hedera Consensus Service deliberately, and the reasons matter.

**Ordering and timestamps.** HCS provides consensus-ordered, consensus-timestamped messages. When we log a contribution to a song's topic, we get a timestamp that's agreed upon by the network — not set by the client. This matters for provenance. The order of creative decisions is part of the story.

**Immutability without overhead.** HCS topics are append-only. You can't edit history. You can't delete contributions. The record is permanent. And because HCS messages are lightweight (just the consensus layer, no smart contract execution), there's no computational overhead.

**Economics.** Creating an HCS topic costs approximately $0.01. Submitting a message costs approximately $0.0008. An artist can establish their identity, create a song topic, log fifty contributions, and issue a provenance credential for less than a nickel. Compare that to Ethereum, where a single transaction can cost more than the song earns in its first year of streaming.

**Why not Ethereum?** Cost, speed, and fit. We don't need smart contracts. We don't need a token. We need an ordered, timestamped, immutable log. HCS is exactly that — no more, no less.

**Why not IPFS?** IPFS is great for content storage, but it doesn't provide ordering or consensus timestamps. A hash on IPFS proves something exists; it doesn't prove when it was created or in what order relative to other artifacts. HCS gives us both.

**Why not a traditional database?** Because "trust me, I wrote it down" is exactly the problem we're solving. A database controlled by a single entity is just a fancier version of the gentleman's agreement. The whole point is that the provenance record exists outside any single party's control.

---

## 6. The Sentinel Network

We started with one sentinel. The platform — Provenance Studio — watches you make the song and co-signs the credential. But one sentinel is a beginning, not the destination.

Consider what happens when a song moves beyond creation:

A film producer discovers the track and wants to license it. A distributor picks it up for streaming. A rights organization clears it for international use. A label signs the artist. Each of these is a **different trust domain** with a **different authority** watching a **different process**.

The architecture already supports this. A credential can carry multiple signatures in its proof array. Each sentinel has its own DID. Each co-signs credentials in its domain:

- **Creation Sentinel** (Provenance Studio) — "I watched the artist make this. The creative workflow was real."
- **Marketplace Sentinel** — "I processed the licensing transaction. The stake was placed, the payment was distributed per the creators array."
- **Distribution Sentinel** — "This work meets our content requirements. Provenance verified."
- **Legal Sentinel** — "The ownership chain is clear. No competing claims found."
- **Label Sentinel** — "This artist is on our roster. We vouch for their identity."

A song accumulates sentinel attestations as it moves through the world. A credential with one sentinel co-signature is provenance. A credential with four is a reputation.

### Licensing Through Staking

The sentinel network enables a marketplace model that collapses licensing into a single transaction.

Today, licensing a song requires: discovery of terms, negotiation, contract signing, payment processing, rights clearance. Each step involves different parties, different documents, different timelines.

In a sentinel-networked marketplace:

1. The licensee finds the song and reads its VC — creators, splits, sentinel attestation, all on-chain
2. The licensee **stakes HBAR** on the song's topic — the stake IS the license fee
3. Hedera Token Service auto-distributes: 50% to Jeff, 25% to Sam, 25% to Jon (per the creators array)
4. The marketplace sentinel takes a 2-3% fee and co-signs a **License VC**
5. The license grant is recorded on-chain — a new credential referencing the original provenance

Three things collapse into one: **discovery, agreement, and payment.** The VC says who gets paid. The stake is the deal. The sentinel witnesses the transaction.

The license credential itself becomes portable proof: "This entity paid X to use this work, verified by the marketplace sentinel, distributed per the original credential." Anyone downstream can verify the license the same way they verify the provenance — resolve the DIDs, check the signatures, confirm the chain.

### Trust Compounds

Here's the deeper insight: **provenance makes licenses more valuable, not less.**

A film producer licensing a song with 77 documented creative decisions, a creation sentinel co-signature, and verified ownership splits isn't just getting music — they're getting legal cover. If anyone challenges the use, the provenance chain IS the defense. The more provenance, the safer the license. The safer the license, the higher the stakes people are willing to place.

The economics reward doing the work of documenting your process. Thorough provenance → stronger sentinel attestation → higher trust score → more licensing demand → more revenue. The system incentivizes exactly the behavior we want: artists proving their creative authority.

### Sentinel Economics: Reputation as a Computed Asset

Here's where the sentinel network becomes self-sustaining. If sentinels stake on every credential they co-sign, they have skin in the game. But staking alone is a static commitment. What makes it dynamic is **reputation** — a score computed from on-chain behavior that determines how much trust, and how much revenue, a sentinel attracts.

**The Reputation Function**

A sentinel's reputation score is computed from its track record:

- Credential goes unchallenged for 90 days → reputation +1
- Credential independently verified by another sentinel → reputation +2
- Credential disputed and the sentinel was right (challenge rejected) → reputation +5
- Credential disputed and the sentinel was wrong (challenge upheld) → reputation -50, stake slashed

The asymmetry is deliberate. It takes 50 good attestations to recover from one bad one. Trust is hard to build, easy to destroy, and impossible to fake — because it's computed from immutable on-chain history, not self-reported.

**A Credit Rating for Trust**

FICO scores rate financial trustworthiness. Sentinel reputation scores rate *attestation* trustworthiness. And like FICO, the score compounds:

- A sentinel with 500 unchallenged attestations and a 99.8% accuracy rate is a premium service
- A sentinel with 50 attestations and two disputes is a risk
- A sentinel with zero track record is unproven — artists might choose it for lower fees, but licensees will discount its attestation

The score is public. It's on-chain. It's computed, not claimed. Anyone can query the sentinel registry contract and see exactly how trustworthy a sentinel is based on what it's actually done.

**The Flywheel**

Higher reputation creates an economic flywheel:

1. Good attestations → reputation grows
2. Higher reputation → more artists choose this sentinel
3. More artists → more credentials co-signed → more licensing flow
4. More licensing flow → more fees (2-3% of each transaction)
5. More fees → more stake to put at risk → stronger trust signal
6. Stronger signal → more artists choose this sentinel
7. Repeat

Bad sentinels get pushed out economically. They can't attract artists because their score is low. They can't attract licensees because their attestation is weak. The market self-selects for trust without anyone appointing who's trustworthy.

**Smart Contract Infrastructure**

This economy runs on three contracts on Hedera Smart Contract Service:

**1. Sentinel Registry Contract**
- Registers sentinel DIDs with an initial stake (minimum threshold)
- Tracks reputation scores on-chain
- Exposes `isApproved(sentinelDID)` and `reputationScore(sentinelDID)` for other contracts to query
- Handles stake slashing when disputes are upheld
- Anyone can become a sentinel by staking and registering — permission is economic, not administrative

**2. Licensing Contract**
- Holds staked HBAR in escrow during licensing transactions
- Reads the creators array from the VC to determine distribution splits
- Checks the sentinel registry before accepting a co-signature
- Auto-distributes on completion: creator shares + sentinel fee
- Handles disputes: freezes escrow, routes to resolution, slashes the losing party

**3. Verification Contract**
- Moves our `/credentials/verify` logic on-chain — trustless verification
- Checks: VC structure, creator shares sum to 100, signatures valid, sentinel registered and in good standing
- Returns a verification result that other contracts can consume
- No one has to trust our API — the contract IS the verifier

These three contracts compose: the licensing contract checks the verification contract, which checks the registry contract. Trust flows through code, not through us.

**The Sentinel Isn't Appointed — It Earns**

This is the key insight, and it connects directly back to the architectural principle: sentinels don't derive authority from permission. They derive it from demonstrated reliability with economic consequences. The smart contracts enforce the rules. The reputation score reflects reality. The market rewards trust.

The architecture computes authority from behavior. That's not just a technical design — it's a governance philosophy.

## 7. Implications

We built this for music. But the architecture doesn't know that.

The five-layer model — primitives, ontology, assertions, sentinels, state — is domain-agnostic. Swap "artist" for "author" and "song" for "manuscript" and you have a provenance system for AI-assisted writing. Swap for "designer" and "blueprint" and you have architectural provenance. Swap for "researcher" and "dataset" and you have scientific provenance.

The sentinel network scales the same way. A publishing sentinel co-signs manuscripts. An architecture sentinel co-signs building designs. A scientific sentinel co-signs datasets. Each domain gets its own trust authority, its own staking economics, its own marketplace.

The deeper implication is philosophical. We're entering an era where the *process* of creation matters as much as the *product*. When anyone can generate a finished artifact with a prompt, the value shifts to creative direction, curation, and decision-making — the human judgment that shaped the output. Provenance infrastructure doesn't just record that shift. It makes it legible. It makes it provable. It makes it valuable.

This is what "Provenance as a Service" means. Not a product. Not a platform. An infrastructure layer that any creative tool can integrate. Issue DIDs. Log contributions. Sign credentials. Co-sign with a sentinel. Verify the chain. The building blocks are open, composable, and cheap enough to use for every creative act, not just the ones worth litigating over.

---

## 8. Conclusion

We started this project with a question: in a world where AI can generate music, what does it mean to be the artist?

The answer, we discovered, isn't about the AI at all. It's about the infrastructure we never built. For decades, creative provenance has been an afterthought — a metadata field, a liner note, a handshake. AI didn't break that system. There was no system to break.

What we built on Hedera is the beginning of that system. Artist identities anchored to decentralized identifiers. Contribution histories logged to consensus-ordered topics. Provenance claims encoded as Verifiable Credentials with dual-proof signatures. A sentinel model that distinguishes between "I said I did this" and "the process confirms I did this." Collaborative ownership encoded in the credential itself — no contracts, no disputes, cryptographic facts.

The five-layer architecture gives us a framework for reasoning about trust that extends far beyond music. Primitives define what can exist. Ontology defines how things connect. Assertions define what happened. Sentinels define who validates. State is computed from truth. Each layer depends on the ones below it. Skip one and trust collapses.

The tagline writes itself, because it's not a tagline — it's a thesis statement:

**AI made the music. The blockchain proves I'm the artist. The sentinel confirms the process was real.**

That's not a limitation on AI. It's an invitation. Use every tool available. Generate, remix, collaborate with machines. But do it inside an infrastructure where your creative authority is recorded, attested, and permanently provable. Not because the law requires it. Because the work deserves it.

---

*Built on Hedera Consensus Service. Anchored in W3C Verifiable Credentials. Witnessed by sentinels. Owned by artists.*
