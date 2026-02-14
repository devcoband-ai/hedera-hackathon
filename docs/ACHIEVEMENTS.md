# The Achievement Catalog

*Badges as Micro-Credentials: Why Open Badges Beat NFTs, and How to Earn Them*

---

## The Product Owner's First Correction

Jack said it plainly: "I don't know about NFTs. They're so unpopular right now."

He was right. The product owner's job is to translate vision into market reality, and this was his first real contribution: same on-chain capability, better positioning. NFTs carry baggage. The speculative craze, the environmental hand-wringing, the association with jpeg apes and rug pulls. We were building something fundamentally different—proof of creative contribution, not tradable speculation—but the word "NFT" would bury the message before anyone heard it.

Open Badges are the answer. Same cryptographic proof. Same immutable record. Same verifiable chain of custody. But badges are *earned*, not purchased. They're *collected*, not traded. They represent accomplishment, not speculation. LinkedIn understands this. Credly built a business on it. The IMS Global Learning Consortium formalized it as Open Badges 3.0.

What we're building: achievement credentials for creative work, anchored on Hedera, structured as OB3-compliant Verifiable Credentials. You earn them by doing things that matter. The chain proves you did.

Every badge costs approximately **$0.002** to issue on Hedera testnet. Two-tenths of a penny. A full "Album Legend" credential stack (27+ badges) costs about a nickel.

---

## How Badges Work

Each badge is an `AchievementCredential`—a Verifiable Credential conforming to Open Badges 3.0. When you earn one:

1. The platform constructs a W3C-compliant VC with your DID as the subject
2. The achievement criteria are embedded in the credential
3. Evidence links to your Hedera provenance chain (HCS topics)
4. Dual signatures: your key (asserting you did the work) + sentinel key (attesting the platform witnessed it)
5. The badge VC is submitted to your HCS topic
6. Optional: badge artwork hash is anchored for integrity

Badges compose. Individual achievements stack into composite credentials. A "Verified Independent Artist" isn't one badge—it's the combination of Identity Established + First Track + Sentinel-Attested. The whole is greater than the parts, and every part is independently verifiable.

---

## Category 1: Artist Identity

Establishing who you are before you prove what you made.

### 1. Identity Established

**Name:** Identity Established  
**Description:** Your DID exists. You've stepped from anonymity into cryptographic identity. The chain knows who you are.  
**Criteria:** Artist DID created and successfully resolved on Hedera. The DID document must be retrievable from the assigned HCS topic.  
**Evidence:** HCS topic containing DID document (type: `DIDDocument`)  
**OB3 Achievement Type:** `Achievement` with criteria narrative  

### 2. Creative DNA On-Chain

**Name:** Creative DNA On-Chain  
**Description:** More than a name—your full creative identity anchored. Lineage, manifesto, influences. The things that make you *you*, now immutable.  
**Criteria:** DID document includes extended artist profile: influences array (minimum 3), artistic statement/manifesto (minimum 100 words), and lineage/background.  
**Evidence:** HCS topic containing extended DIDDocument with service endpoint of type `ArtistProfile`  
**OB3 Achievement Type:** `Achievement`  

### 3. Visual Identity Anchored

**Name:** Visual Identity Anchored  
**Description:** Your face. Your brand. Your visual signature, locked with SHA-256. When someone sees your profile image, they can prove it's the original.  
**Criteria:** Profile imagery submitted to HCS topic with SHA-256 hash. Hash message must precede or accompany the image reference. Integrity verifiable against original file.  
**Evidence:** Hash message on artist topic + retrievable image matching hash  
**OB3 Achievement Type:** `Achievement`  

### 4. Pioneer Artist

**Name:** Pioneer Artist  
**Description:** You were here when the chain was young. Among the first artists to establish identity during the hackathon build period. Future generations will see your early topic IDs and know.  
**Criteria:** Artist DID created during the official hackathon period (February 2026). Topic ID must fall within the pioneer range.  
**Evidence:** HCS topic timestamp within qualifying period  
**OB3 Achievement Type:** `Achievement`  

---

## Category 2: Creation & Provenance

Making things, and proving you made them.

### 5. First Track

**Name:** First Track  
**Description:** Your first song with a complete provenance chain. Not a demo lost to a hard drive—a creative work with proof of existence, anchored forever.  
**Criteria:** Song HCS topic created with at least one contribution message and a `VerifiableCredential` of type `ProvenanceCredential` issued.  
**Evidence:** Song topic with VC submission  
**OB3 Achievement Type:** `Achievement`  

### 6. Provenance Complete

**Name:** Provenance Complete  
**Description:** Full chain of custody. Every decision logged, from initial prompt to final release. The complete story of how a song came to be.  
**Criteria:** Song topic contains: (1) initial creative input, (2) minimum 5 contribution messages, (3) final master hash, (4) ProvenanceCredential with all artifacts listed.  
**Evidence:** Song topic with complete contribution chain + final VC  
**OB3 Achievement Type:** `Achievement`  

### 7. AI Collaborator

**Name:** AI Collaborator  
**Description:** You worked with the machine and were honest about it. Human-directed, AI-assisted, clearly attributed. This is how the future creates.  
**Criteria:** VerifiableCredential issued with creators array that includes both human DID(s) and the AI collaborator DID, with explicit share percentages assigned to AI contributions.  
**Evidence:** ProvenanceCredential with mixed human/AI creator attribution  
**OB3 Achievement Type:** `Achievement`  

### 8. Catalog Builder

**Name:** Catalog Builder  
**Description:** Not a one-hit wonder. Ten tracks anchored. A body of work emerging, each piece with its own provenance chain.  
**Criteria:** Artist has issued ProvenanceCredentials for 10 or more distinct songs. Each song must have its own HCS topic.  
**Evidence:** 10+ song topics linked to artist DID  
**OB3 Achievement Type:** `Achievement`  

### 9. Album Provenance

**Name:** Album Provenance  
**Description:** A complete album with per-track credentials. The whole collection anchored, every song proven, relationships mapped.  
**Criteria:** Album-level HCS topic created with (1) album metadata, (2) track listing with individual song topic references, (3) album-level ProvenanceCredential linking all tracks.  
**Evidence:** Album topic with track references + album VC  
**OB3 Achievement Type:** `Achievement`  

---

## Category 3: Collaboration & Ownership

Creating together, splitting fairly, proving both.

### 10. First Collab

**Name:** First Collab  
**Description:** Your first multi-party credential. Two or more creators, one work, shares that sum to 100. Collaboration, crystallized.  
**Criteria:** ProvenanceCredential issued with creators array containing 2+ distinct DIDs (excluding AI), each with assigned share percentage.  
**Evidence:** Song topic with multi-party VC  
**OB3 Achievement Type:** `Achievement`  

### 11. Split Verified

**Name:** Split Verified  
**Description:** Ownership percentages on-chain, sentinel-attested, mathematically verified to sum to 100%. No ambiguity. No "we'll figure it out later." The split is the split.  
**Criteria:** ProvenanceCredential with creators array where (1) all shares are explicit numbers, (2) shares sum to exactly 100, (3) sentinel co-signature present.  
**Evidence:** VC with verified split + dual proof  
**OB3 Achievement Type:** `Achievement`  

### 12. Producer Credit

**Name:** Producer Credit  
**Description:** Your production contribution, formally credited. Not "featuring" or "with"—producer, verified, on-chain.  
**Criteria:** Creator entry in VerifiableCredential with role explicitly set to "producer" and share percentage assigned.  
**Evidence:** VC with producer role attribution  
**OB3 Achievement Type:** `Achievement`  

### 13. Bandmate

**Name:** Bandmate  
**Description:** Five or more collaborative credentials with the same co-creator. You've built something together, repeatedly. That's a band.  
**Criteria:** 5+ ProvenanceCredentials exist where both your DID and a specific collaborator's DID appear in the creators array.  
**Evidence:** Cross-referenced VCs showing repeated collaboration  
**OB3 Achievement Type:** `Achievement`  

### 14. Equitable Split

**Name:** Equitable Split  
**Description:** No single creator exceeds 50%. A true collaboration where power is distributed. The hardest split to agree to, the fairest split to prove.  
**Criteria:** ProvenanceCredential with 2+ creators where no individual share exceeds 50%.  
**Evidence:** VC with balanced creator shares  
**OB3 Achievement Type:** `Achievement`  

---

## Category 4: Trust & Integrity

The mechanisms that make everything else believable.

### 15. Sentinel-Attested

**Name:** Sentinel-Attested  
**Description:** Your first credential with independent witnessing. Two signatures: yours (I did this) and the sentinel's (I saw them do it). This is how trust scales.  
**Criteria:** VerifiableCredential issued with proof array containing both issuer signature (proofPurpose: assertionMethod) and sentinel signature (proofPurpose: authentication).  
**Evidence:** VC with dual-proof array  
**OB3 Achievement Type:** `Achievement`  

### 16. Hash Verified

**Name:** Hash Verified  
**Description:** An artifact with on-chain integrity. File hash anchored. When the file exists and the hash matches, you've proven the artifact is unchanged since anchoring.  
**Criteria:** SHA-256 hash message submitted to HCS topic with corresponding artifact (audio, image, document) verifiable against hash.  
**Evidence:** Hash message on topic + matching artifact  
**OB3 Achievement Type:** `Achievement`  

### 17. Revocation Survived

**Name:** Revocation Survived  
**Description:** Your credential was challenged and upheld. Someone questioned it. The verification passed. The proof held.  
**Criteria:** VerifiableCredential that (1) was submitted for revocation consideration, (2) passed re-verification, (3) remains valid with no revocation message on topic.  
**Evidence:** Verification records + absence of revocation on topic  
**OB3 Achievement Type:** `Achievement`  

### 18. Trust Recovered

**Name:** Trust Recovered  
**Description:** A credential was revoked. A new one was issued. The system worked—mistakes can be corrected, trust can be rebuilt.  
**Criteria:** Artist topic shows (1) a revoked credential, followed by (2) a new valid credential for the same or replacement work, with (3) explicit reference to the correction.  
**Evidence:** Revocation message + subsequent valid VC  
**OB3 Achievement Type:** `Achievement`  

### 19. Verification Champion

**Name:** Verification Champion  
**Description:** Ten or more credentials verified. You've used the system to check others' work. Trust isn't just claimed—you've actively verified it.  
**Criteria:** 10+ calls to the verification endpoint resulting in successful validation (all checks passed).  
**Evidence:** Platform verification logs  
**OB3 Achievement Type:** `Achievement`  

---

## Category 5: Platform & Builder

For those who didn't just use the platform—they built it.

### 20. Day One Builder

**Name:** Day One Builder  
**Description:** You were in the room when the code was written. Not a user—a builder. The commits remember.  
**Criteria:** Git commits during the initial build session (Day 1 hackathon). Author email must match verified developer identity.  
**Evidence:** Git commit history within qualifying window  
**OB3 Achievement Type:** `Achievement`  

### 21. Hackathon Participant

**Name:** Hackathon Participant  
**Description:** Registered and submitted. You showed up when it mattered, contributed to a project that didn't exist 48 hours earlier.  
**Criteria:** Official hackathon registration + qualifying submission. May include code, documentation, or validated test participation.  
**Evidence:** Hackathon submission records  
**OB3 Achievement Type:** `Achievement`  

### 22. Open Standard Adopter

**Name:** Open Standard Adopter  
**Description:** Your first OB3-compliant credential issued. Not a proprietary format—an open standard that any conforming system can verify.  
**Criteria:** AchievementCredential issued with proper OB3 context URLs and schema-valid structure.  
**Evidence:** VC with OB3 context validation  
**OB3 Achievement Type:** `Achievement`  

### 23. Domain Pioneer

**Name:** Domain Pioneer  
**Description:** You took the architecture beyond music. Same five layers, different vertical. Film. Photography. Writing. You proved the pattern generalizes.  
**Criteria:** Implementation of the provenance architecture in a non-music domain. Must include DID creation, contribution tracking, and VC issuance for the new domain.  
**Evidence:** Topic + VCs in non-music domain  
**OB3 Achievement Type:** `Achievement`  

---

## Category 6: The Highman Group

Badges for the team building the future.

### 24. Founding Intern

**Name:** Founding Intern  
**Description:** Summer 2026 inaugural cohort. The first class. When this company succeeds, you'll have the badge that proves you were there at the beginning.  
**Criteria:** Member of the Summer 2026 internship cohort at The Highman Group. Verified employment records.  
**Evidence:** HR verification + onboarding records  
**OB3 Achievement Type:** `Achievement`  

### 25. Feature Shipped

**Name:** Feature Shipped  
**Description:** Merged production code. Not a PR that sat there—code that made it to main, passed review, and shipped to users.  
**Criteria:** Pull request merged to production branch with verified authorship. Feature must be user-facing or platform-critical.  
**Evidence:** Git merge commit on production branch  
**OB3 Achievement Type:** `Achievement`  

### 26. Customer Discovery

**Name:** Customer Discovery  
**Description:** You conducted a structured discovery session. Talked to real potential users. Captured insights. Did the hard work of understanding what people actually need.  
**Criteria:** Documented customer discovery session following structured methodology. Notes reviewed and incorporated into product development.  
**Evidence:** Session documentation + product backlog reference  
**OB3 Achievement Type:** `Achievement`  

### 27. Domain Instance

**Name:** Domain Instance  
**Description:** Applied the five-layer architecture to a new vertical. Not music—something else entirely. You proved the pattern works beyond its origin.  
**Criteria:** Complete implementation of provenance architecture in new vertical: (1) domain-specific DIDs, (2) contribution tracking, (3) VCs issued, (4) verification functional.  
**Evidence:** Domain deployment documentation + working endpoints  
**OB3 Achievement Type:** `Achievement`  

---

## Showcase: The "Let's Stay This Way" Album Badges

Twelve tracks. Twelve stories. Twelve badges that prove software can have a sense of humor while maintaining cryptographic rigor.

These are the recommended MVP demo badges—each one tells the story of how a specific song came to be, with all the accidents, arguments, and absurdities preserved forever on-chain.

---

### Track 1: "Is This Song About Me?"

**Badge Name:** Is This Song About Me?  
**Song:** Screwed  
**Description:** Jon asked if the song was about him. The provenance chain said no. Badge earned: first track to cause an existential crisis in the label president.  
**The Story:** Sam heard the first demo and said: "If this is the best you can do, we're screwed." The critique became the hook. Jon's butt was accidentally referenced in a Suno prompt. IMMUTABLE. ON-CHAIN FOREVER. When Jon asked if the song was about him, we pointed to the provenance chain. The chain doesn't lie. The chain also doesn't forget about the butt.  
**Criteria:** Song that prompted a documented identity inquiry from a collaborator, with the provenance chain providing the definitive answer.  
**Evidence:** HCS topic `0.0.7930486` — 7 contributions on-chain  
**OB3 Achievement Type:** `Achievement`  
**Image Hash:** SHA-256 of badge artwork  

---

### Track 2: "Cover Art Wrote a Song"

**Badge Name:** Cover Art Wrote a Song  
**Song:** Sounds Like Heaven  
**Description:** The album cover painting inspired lyrics that describe the painting. Art made the words that explain the art. Badge earned: creative ouroboros.  
**The Story:** Jeff stared at the cover art—brilliant orange, glitched trailer park sunset—and wrote: "Brilliant orange tarnished by the sea." The painting spoke. The lyrics answered. The same words will appear three times on this album, each time meaning something different.  
**Criteria:** Lyrics demonstrably derived from visual artwork, with artwork provenance on same album topic.  
**Evidence:** HCS topic `0.0.7930491` — 3 contributions on-chain  
**OB3 Achievement Type:** `Achievement`  

---

### Track 3: "The Simulation That Shipped"

**Badge Name:** The Simulation That Shipped  
**Song:** Ciudad  
**Description:** Started as a dry run test of the provenance system. Accidentally became a real track with 7 contributions. Badge earned: test data that went platinum.  
**The Story:** Ciudad was supposed to be a simulation—a way to test whether the provenance architecture actually worked. But somewhere between "let's run through the flow" and "this actually slaps," it became real. Jon objected: "Machines don't make art." OVERRULED. The test data shipped at track 3.  
**Criteria:** Song that originated as system testing and was subsequently released as official album content.  
**Evidence:** HCS topic `0.0.7930493` — 7 contributions on-chain, including objection override  
**OB3 Achievement Type:** `Achievement`  

---

### Track 4: "The Drunk Poet"

**Badge Name:** The Drunk Poet  
**Song:** Unannounced  
**Description:** Jeff typed "Unnnouced." The AI tried to pronounce the misspelling and stumbled into something that sounds like a drunk poet having a revelation. Sam said "keep it." Badge earned: typo as artistic direction.  
**The Story:** The title was supposed to be "Unannounced." But Jeff's fingers betrayed him. "Unnnouced." The AI, bless its literal heart, tried to pronounce it. The result sounded like a drunk poet at 2am, stumbling through a revelation they won't remember tomorrow. Sam's production note: "Keep it." The imperfection IS the art. Immutable. On-chain forever.  
**Criteria:** Creative artifact where typographical error was intentionally preserved as artistic choice, with preservation decision documented.  
**Evidence:** HCS topic `0.0.7930496` — 5 contributions on-chain, typo preserved  
**OB3 Achievement Type:** `Achievement`  

---

### Track 5: "Same Words, Different Movie"

**Badge Name:** Same Words, Different Movie  
**Song:** Album Cover Painting  
**Description:** Same lyrics as Track 2, completely different song. The prompt is authorship. Badge earned: proving the thesis with the same poem twice.  
**The Story:** Same lyrics. Acoustic treatment at 76 BPM. Jeff cited Seal: two versions of the same lyrics on one album, completely different songs. Jon objected. Overruled with what we now call the "Category A precedent"—established artists have done this, and the differentiation IS creative work.  
**Criteria:** Song sharing 100% lyrical content with another track on same album, with distinct production proving prompt-as-authorship thesis.  
**Evidence:** HCS topic `0.0.7930498` — 4 contributions, Category A precedent logged  
**OB3 Achievement Type:** `Achievement`  

---

### Track 6: "No Robots Were Harmed"

**Badge Name:** No Robots Were Harmed  
**Song:** Already True  
**Description:** 100% human. Every word. The album's soul. Badge earned: all-human creative work in an AI-assisted album.  
**The Story:** Jeff fed 75 pages per month of journals—100,000+ thoughts—into Grok and GPT. The AIs converged on one truth: "You were already what you were trying to become." And then Jeff wrote every word himself. Zero AI generation. Sam's production note: "Don't touch the production." Jon's note: "Don't touch anything." This one is sacred.  
**Criteria:** Song with verified 100% human authorship (no AI generation) in an album that includes AI-assisted tracks.  
**Evidence:** HCS topic `0.0.7930499` — 5 contributions, all human attribution  
**OB3 Achievement Type:** `Achievement`  

---

### Track 7: "The Child That Became the Parent"

**Badge Name:** The Child That Became the Parent  
**Song:** Pop Song Summer  
**Description:** Its derivative's prompt became the Devco sound template. The child's DNA defined the parent's identity. Badge earned: reverse genealogy.  
**The Story:** Derived from Jeff's published book (Kindle, copyrighted): "Take second lover, the over and under." But here's the paradox: the derivative "Second Love" prompt became the 147-word Devco sound template. The child's DNA defined the parent's identity. The provenance chain recurses backwards.  
**Criteria:** Song whose derivative work's prompt was adopted as the project's defining creative template.  
**Evidence:** HCS topic `0.0.7930502` — 4 contributions, recursive provenance documented  
**OB3 Achievement Type:** `Achievement`  

---

### Track 8: "Genre Is Authorship"

**Badge Name:** Genre Is Authorship  
**Song:** Intimate Restraint  
**Description:** Same words, different genre prompt, completely different meaning. The genre choice IS the creative decision. Badge earned: proving genre as authorship.  
**The Story:** V1: sultry, minimal. Sam heard Sade. Jeff rejected it. V2 suggestion from Jon: dream pop. Also rejected. Final: ambient psytrance tribal ethereal—Jeff's vision prevailed. Same lyrics, different genre, completely different meaning. The genre choice is the authorship. Logged as creative principle.  
**Criteria:** Song with multiple genre iterations documented, demonstrating that prompt/genre selection constitutes creative authorship.  
**Evidence:** HCS topic `0.0.7930505` — 5 contributions, genre iterations logged  
**OB3 Achievement Type:** `Achievement`  

---

### Track 9: "The Cathedral"

**Badge Name:** The Cathedral  
**Song:** Let's Stay This Way  
**Description:** Written January 4th before any of this existed. The song the album grew around. Badge earned: origin point, placed at the center not the beginning.  
**The Story:** January 4, 2026. Before the album concept. Before the architecture. Before the provenance system. Jeff wrote: "It sounds like heaven when you lie, but I see it when you roll your eyes." The title track. Placed at track 9—not the beginning, but the center of gravity. The heart of the album, beating at its core.  
**Criteria:** Song predating project inception that became the titular track, with non-sequential placement demonstrating intentional structural decision.  
**Evidence:** HCS topic `0.0.7930509` — 4 contributions, pre-project origin documented  
**OB3 Achievement Type:** `Achievement`  

---

### Track 10: "The Process Watching Itself"

**Badge Name:** The Process Watching Itself  
**Song:** Flowin  
**Description:** Meta-track. The process reflecting on its own creation. Badge earned: recursive self-awareness.  
**The Story:** A song about trying to write songs. V1 was atmospheric grungecore—rejected. V2 happened because the prompt got truncated. Happy accident. "When it's flowing you're not alone" repeats three times—the mantra of creation. The process watching itself, documented by itself, proving itself.  
**Criteria:** Meta-song about the creative process, with documented accidental contribution (truncated prompt) that improved the work.  
**Evidence:** HCS topic `0.0.7930512` — 4 contributions, meta-content verified  
**OB3 Achievement Type:** `Achievement`  

---

### Track 11: "Wrong Season, Right Feeling"

**Badge Name:** Wrong Season, Right Feeling  
**Song:** Christmas Time  
**Description:** A Christmas song that doesn't need December. Warmth before the end. Badge earned: seasonal defiance.  
**The Story:** Written Christmas Day. Six words in the prompt: "acoustic folk harmony laced gratitude." Sometimes that's enough. Remixed with "shoegaze dream pop 1999"—nostalgia filter. A Christmas song that works any day of the year. Warmth placed near the album's end, because endings deserve warmth.  
**Criteria:** Seasonal song with out-of-season placement decision documented, demonstrating thematic use over calendar requirement.  
**Evidence:** HCS topic `0.0.7930516` — 4 contributions, Christmas Day origin  
**OB3 Achievement Type:** `Achievement`  

---

### Track 12: "The Ouroboros Badge"

**Badge Name:** The Ouroboros Badge  
**Song:** Sounds Like Heaven Revisited  
**Description:** Full circle. Same words as Track 2 and 5, their third appearance. Acoustic, quiet, stripped. Badge earned: transformation through repetition.  
**The Story:** Same lyrics as Track 2 and Track 5. Third and final appearance. Acoustic, quiet, stripped back—the lyrics finally naked. Placed at track 12 because the album ends where it began. Full circle. The ouroboros. Three versions of the same words, three completely different songs, one proof: the prompt is the authorship.  
**Criteria:** Song completing a lyrical trilogy within a single album, with placement demonstrating intentional circular structure.  
**Evidence:** HCS topic `0.0.7930517` — 3 contributions, final trilogy instance  
**OB3 Achievement Type:** `Achievement`  

---

## Jon's Recommended Stack

The MVP showcase for Jon as demonstration artist. Seven badges that tell a complete story:

| Badge | Why |
|-------|-----|
| **Identity Established** | Jon's DID exists on Hedera. He's real. |
| **Creative DNA On-Chain** | Full profile: Local Records president, The Dark Navy, influences anchored |
| **Visual Identity Anchored** | Profile image with hash integrity |
| **Pioneer Artist** | Topic ID `0.0.7930480` — early adopter |
| **First Track** | First song with complete provenance |
| **AI Collaborator** | Participated in AI-assisted tracks with honest attribution |
| **Sentinel-Attested** | Dual-signed credentials proving platform witnessed |

This stack represents **Verified Independent Artist** status—the minimum viable proof that an artist exists, creates, and can be trusted.

---

## Composability Map

Individual badges compose into credential stacks:

### Verified Independent Artist
```
= Identity Established 
+ First Track 
+ Sentinel-Attested
```
The minimum proof: you exist, you created something, the platform witnessed.

### Collaborative Producer
```
= Identity Established 
+ First Collab 
+ Producer Credit 
+ Split Verified
```
You work with others, your production role is verified, the splits are mathematically sound.

### Full Provenance Artist
```
= Creative DNA On-Chain 
+ Provenance Complete 
+ AI Collaborator 
+ Album Provenance 
+ Hash Verified
```
Maximum transparency. Every aspect of identity and creation anchored with integrity.

### Album Legend
```
= Album Provenance 
+ All 12 Song Badges
```
The full "Let's Stay This Way" achievement stack. Complete album provenance plus every track's unique story, on-chain.

---

## OB3 Technical Mapping

Example AchievementCredential structure for a song badge:

```json
{
  "@context": [
    "https://www.w3.org/ns/credentials/v2",
    "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json"
  ],
  "type": ["VerifiableCredential", "AchievementCredential"],
  "issuer": {
    "id": "did:hedera:testnet:<sentinel_public_key>_<sentinel_topic>",
    "type": "Profile",
    "name": "Provenance Studio"
  },
  "validFrom": "2026-02-13T00:00:00Z",
  "credentialSubject": {
    "type": "AchievementSubject",
    "id": "did:hedera:testnet:<artist_public_key>_<artist_topic>",
    "achievement": {
      "type": "Achievement",
      "name": "The Drunk Poet",
      "description": "Jeff typed 'Unnnouced.' The AI tried to pronounce the misspelling and stumbled into something that sounds like a drunk poet having a revelation. Sam said 'keep it.' Badge earned: typo as artistic direction.",
      "criteria": {
        "narrative": "Creative artifact where typographical error was intentionally preserved as artistic choice, with preservation decision documented."
      },
      "image": {
        "id": "https://assets.provenance.studio/badges/drunk-poet.png",
        "type": "Image"
      }
    }
  },
  "evidence": [{
    "id": "https://hashscan.io/testnet/topic/0.0.7930496",
    "type": "Evidence",
    "name": "Hedera Provenance Chain"
  }],
  "proof": [
    {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-02-13T19:00:00Z",
      "proofPurpose": "assertionMethod",
      "verificationMethod": "did:hedera:testnet:<artist_key>_<artist_topic>#key-1",
      "proofValue": "<artist_signature_hex>"
    },
    {
      "type": "EcdsaSecp256k1Signature2019",
      "created": "2026-02-13T19:00:00Z",
      "proofPurpose": "authentication",
      "verificationMethod": "did:hedera:testnet:<sentinel_key>_<sentinel_topic>#did-root-key",
      "proofValue": "<sentinel_signature_hex>"
    }
  ]
}
```

---

## Cost Model

Hedera Consensus Service pricing (testnet/mainnet):

| Operation | Cost |
|-----------|------|
| Create HCS Topic | ~$0.01 |
| Submit Message | ~$0.0001 |
| Badge Credential (avg) | ~$0.002 |

**Full badge collection cost estimates:**

- Single badge: $0.002
- Jon's 7-badge stack: $0.014
- Album Legend (27 badges): $0.054
- Full catalog (all 39 badges): $0.078

Fractions of a penny per badge. The cost of trust is negligible.

---

## Why Not NFTs (Jack Was Right)

The NFT conversation happened early. The engineering is similar—both use cryptographic proofs anchored to distributed ledgers. Both are immutable. Both are verifiable.

But badges solve different problems:

| NFTs | Open Badges |
|------|-------------|
| Purchased or minted | Earned |
| Traded and speculated | Collected and displayed |
| Ownership focused | Achievement focused |
| Market-priced | Value-inherent |
| Associated with speculation | Associated with accomplishment |

Jack's feedback: "I don't know about NFTs. They're so unpopular right now."

The product owner's first correction. He wasn't wrong. NFTs carry baggage we don't need. Same on-chain proof, same verification, same immutability—but positioned as earned achievements rather than tradeable assets.

Badges are what people want: proof they did something real. That's it.

---

## Summary

39 badges across 6 categories, plus 12 showcase album badges. Each one:

- Conforms to Open Badges 3.0 specification
- Is anchored to Hedera Consensus Service
- Costs approximately $0.002 to issue
- Dual-signed by artist and platform sentinel
- Links to verifiable evidence on-chain
- Composes with other badges into credential stacks

The architecture is serious. The humor makes people want to collect them. The cryptographic proof makes the collection meaningful.

Jon's butt is on the blockchain forever. But so is the proof that every song was made by real people making real decisions, documented immutably, verifiable by anyone.

That's the Achievement Catalog.
