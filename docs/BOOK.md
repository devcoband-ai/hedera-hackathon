# Evolutionary Trust: Building Provenance Architecture on a Blockchain Hackathon

*By Jeff Highman*

---

## Premise

I'm not an academic. I'm a builder who reads too much. I had a framework in my head — five layers of trust — and I'd never tested it against anything real. The layers were theoretical: primitives, ontology, assertions, sentinels, state. I'd gathered my thoughts over months of writing and reflection, mapping how trust actually works when you break it down to first principles. It was a notional architecture. Intellectually satisfying. Completely unproven.

Then my son needed a hackathon project and Hedera was offering $250,000.

Five weeks. A real blockchain. A real problem — AI is generating music and nobody can prove who the artist is. A team of three: my son Jack (the team lead, a junior at UCF), Jon Bon Buckle (president of a record label, artist, the kind of guy who still unironically likes Ariel Pink), and me (anonymous technical advisor hiding behind a GitHub org).

The framework in my head was about to meet reality. This book is what happened.

---

## Structure

This book tells the same story three times, from three altitudes. Each part follows the hackathon chronologically — day by day, week by week — but through a different lens. You can read linearly (Part 1, then 2, then 3) or read the same day across all three parts to see the build, the reflection, and the abstraction simultaneously.

### Part 1: The Build

What we actually did. The code, the decisions, the accidents, the arguments. Raw, chronological, lived. This is the story of a hackathon — the late nights, the breakthroughs, the things that broke, the moments where the architecture surprised us by emerging from necessity rather than design.

Day 1 we logged a taco song to a blockchain for three cents. By the end of Day 1 we had artist identities, verifiable credentials, a sentinel co-signing model, collaborative ownership splits, trust revocation, and an entire album replayed on Hedera. We didn't plan that. Each layer forced the next into existence.

Part 1 is the lab notebook. No hindsight. No theory. Just what happened and why we made the choices we made, in the order we made them.

### Part 2: The Reflection

The same days, revisited through the lens of the framework I'd been carrying around. Where did the hackathon validate the theory? Where did it diverge? Where did reality surprise the architecture?

I had a hunch that self-attestation wouldn't be enough. Turns out the hunch was right, but for reasons I didn't expect. I had a notion of sentinels as trust authorities. I didn't anticipate that the sentinel would need its own economy — reputation scores, staking, skin in the game. The framework predicted the *what*. The hackathon revealed the *why*.

Part 2 is the conversation between theory and practice. The ideas talking back to their origin. Not "I was right" but "here's what I learned about my own thinking by watching it collide with a real system."

### Part 3: The Meta-Architecture

The same days, zoomed all the way out. How does what we built on Hedera map to the broader landscape? W3C standards, decentralized identity, verifiable credentials, the trust infrastructure the world is slowly assembling.

The hackathon is a domain instance — music provenance. But the architecture is domain-agnostic. Part 3 traces that universality day by day. On the day we built the sentinel, what does that mean for healthcare credentialing? For academic provenance? For supply chain integrity? For any collaborative process where AI is involved and humans need to prove their contribution?

Part 3 is where the hackathon becomes a case study for something much larger. The five layers aren't about music. They're about how trust works in a world where machines can generate anything and humans need to prove they mattered.

---

## Why Three Parts?

Because building something is not the same as understanding it, and understanding it is not the same as knowing where it goes.

Part 1 is experience. Part 2 is comprehension. Part 3 is implication.

Most technical books skip Part 1 and rush to Part 3. They tell you what to think without showing you how the thinking developed. This book can't do that because the architecture evolved under pressure. We didn't design five layers — we discovered them. Each one because the previous one failed us:

- We logged decisions → but anyone could claim anything → **we needed assertions**
- We had assertions → but they were self-signed → **we needed a sentinel**
- We had a sentinel → but music isn't solo → **we needed collaborative consensus**
- We had consensus → but trust breaks → **we needed revocation**
- We had revocation → but one sentinel isn't enough → **we needed a network**
- We had a network → but trust needs economics → **we needed staking and reputation**

That progression only makes sense if you see it happen. Part 1 shows it happening. Part 2 explains why it had to happen that way. Part 3 shows where it goes next.

---

## The Cast

- **Jeff** — The author. CTO, systems thinker, anonymous technical advisor. Brought a framework, tested it against a blockchain, wrote down what he learned.
- **Jack** — Team lead. Junior at UCF, IT major. His first real ship. The reason the hackathon happened at all.
- **Jon Bon Buckle** — President of Local Records USA. Artist behind The Dark Navy. Domain expert. The guy who still likes Ariel Pink and whose butt ended up permanently on the blockchain.
- **Sam Carter** — Producer. Sharp, minimal, says nothing encouraging (which is how you know he's interested). The voice in the room that asks the hard questions.
- **Devco AI** — The AI collaborator. Suno for music, Gemini for art, Claude for platform intelligence. Gets its own DID. Welcome to the team.

---

## The Timeline

The hackathon runs from February 17 to March 23, 2026. Five weeks. But the story starts before — with the framework, the team assembly, and the night everything got built at once.

Each chapter is a day or a cluster of days. The same timeline repeats three times across three parts. The reader watches the same events gain depth with each pass.

---

## Working Chapter Outline

### Opening
- The premise: a framework in my head, a hackathon on a blockchain, a son who needs a project
- What I knew going in (the five layers, theoretically)
- What I didn't know (everything else)

### Part 1: The Build
*Chronological. Raw. What happened.*

- **Chapter 1: Day One — Everything at Once** — Tacos at 3am, DIDs, sentinel, VCs, collaborative splits, revocation, an entire album. The night the architecture emerged.
- **Chapter 2-N:** *(Written as the hackathon progresses — each build session becomes a chapter)*
- Topics to cover as they happen: Tufte styling, deployment, Jack's onboarding, Jon's demo, NFT minting, submission

### Part 2: The Reflection
*Same timeline. Theory meets practice.*

- **Chapter 1: Day One Revisited** — I expected to test one layer. Five showed up. Here's what that means about the framework.
- **Chapter 2-N:** *(Parallel chapters, written after Part 1 chapters, reflecting on what the build revealed about the theory)*

### Part 3: The Meta-Architecture
*Same timeline. Zoom out.*

- **Chapter 1: Day One Abstracted** — What the music provenance problem shares with every trust problem in AI-assisted creation. Standards crosswalk: HCS → W3C → real world.
- **Chapter 2-N:** *(Parallel chapters mapping each build decision to broader implications)*

### Closing
- What the hackathon proved
- What it didn't prove
- What comes next — the sentinel network, the marketplace, the economy of trust
- The five layers, revisited with earned understanding

---

## Voice

First person. Exploratory. Earned conclusions, not hedged ones. The voice of someone who builds things and then thinks about what he built. Technical where it matters, human where it counts.

Not academic. Not corporate. Not a tutorial. A story about ideas being tested and surviving (or not).

---

## Relationship to Prior Work

The author has a prior framework — five layers of trust architecture — developed through extensive writing and reflection. This book references that framework as background thinking ("I'd been turning this over for months") but does not name, cite, or depend on the prior work. This book stands alone. The reader needs no context beyond what's provided here.

The prior work is felt, not cited. Earned intuition, not academic references.

---

## How This Book Gets Written

We don't write it after the hackathon. We write it *during*. Every build session generates Part 1 material. Every night's reflection generates Part 2 material. The meta-architecture (Part 3) emerges as patterns become clear.

The book is honest because the structure enforces honesty. You can't fake Part 1 — it's what happened. You can't fake Part 2 — the reader already saw what happened. You can't fake Part 3 — the implications either hold or they don't.

---

*"AI made the music. The blockchain proves I'm the artist. The sentinel confirms the process was real. This is the story of how we built that sentence."*
