// replay-badges.js
// Issues all 12 "Let's Stay This Way" album song badges on the existing replay topics
// Run: node replay-badges.js

import "dotenv/config";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Client,
  TopicMessageSubmitTransaction,
  PrivateKey,
} from "@hashgraph/sdk";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SENTINEL_PATH = path.join(__dirname, ".sentinel.json");
const RESULTS_PATH = path.join(__dirname, "badge-replay-results.txt");

// ═══════════════════════════════════════════════════════════════
// Album replay data from album-replay-results.txt
// ═══════════════════════════════════════════════════════════════

const ARTIST_DIDS = {
  jeff: "did:hedera:testnet:02c21d708a8fbd1d466892bbe2f9859c8ed5105ac281c8bd440de19f49cf901eef_0.0.7930477",
  sam: "did:hedera:testnet:02c21d708a8fbd1d466892bbe2f9859c8ed5105ac281c8bd440de19f49cf901eef_0.0.7930479",
  jon: "did:hedera:testnet:02c21d708a8fbd1d466892bbe2f9859c8ed5105ac281c8bd440de19f49cf901eef_0.0.7930480",
  ai: "did:hedera:testnet:02c21d708a8fbd1d466892bbe2f9859c8ed5105ac281c8bd440de19f49cf901eef_0.0.7930483",
};

const ARTIST_TOPICS = {
  jeff: "0.0.7930477",
  sam: "0.0.7930479",
  jon: "0.0.7930480",
  ai: "0.0.7930483",
};

const ALBUM_TOPIC = "0.0.7930484";

// Song topics from the replay
const SONG_TOPICS = {
  "Screwed": "0.0.7930486",
  "Sounds Like Heaven": "0.0.7930491",
  "Ciudad": "0.0.7930493",
  "Unannounced": "0.0.7930496",
  "Album Cover Painting": "0.0.7930498",
  "Already True": "0.0.7930499",
  "Pop Song Summer": "0.0.7930502",
  "Intimate Restraint": "0.0.7930505",
  "Let's Stay This Way": "0.0.7930509",
  "Flowin": "0.0.7930512",
  "Christmas Time": "0.0.7930516",
  "Sounds Like Heaven Revisited": "0.0.7930517",
};

// ═══════════════════════════════════════════════════════════════
// The 12 Album Badges — funny but the architecture is serious
// ═══════════════════════════════════════════════════════════════

const ALBUM_BADGES = [
  {
    trackNum: 1,
    song: "Screwed",
    badgeName: "Is This Song About Me?",
    primaryArtist: "jon",
    description: "Jon asked if the song was about him. The provenance chain said no. Badge earned: first track to cause an existential crisis in the label president.",
    criteria: "Song that prompted a documented identity inquiry from a collaborator, with the provenance chain providing the definitive answer.",
  },
  {
    trackNum: 2,
    song: "Sounds Like Heaven",
    badgeName: "Cover Art Wrote a Song",
    primaryArtist: "jeff",
    description: "The album cover painting inspired lyrics that describe the painting. Art made the words that explain the art. Badge earned: creative ouroboros.",
    criteria: "Lyrics demonstrably derived from visual artwork, with artwork provenance on same album topic.",
  },
  {
    trackNum: 3,
    song: "Ciudad",
    badgeName: "The Simulation That Shipped",
    primaryArtist: "sam",
    description: "Started as a dry run test of the provenance system. Accidentally became a real track with 7 contributions. Badge earned: test data that went platinum.",
    criteria: "Song that originated as system testing and was subsequently released as official album content.",
  },
  {
    trackNum: 4,
    song: "Unannounced",
    badgeName: "The Drunk Poet",
    primaryArtist: "jeff",
    description: "Jeff typed 'Unnnouced.' The AI tried to pronounce the misspelling and stumbled into something that sounds like a drunk poet having a revelation. Sam said 'keep it.' Badge earned: typo as artistic direction.",
    criteria: "Creative artifact where typographical error was intentionally preserved as artistic choice, with preservation decision documented.",
  },
  {
    trackNum: 5,
    song: "Album Cover Painting",
    badgeName: "Same Words, Different Movie",
    primaryArtist: "jeff",
    description: "Same lyrics as Track 2, completely different song. The prompt is authorship. Badge earned: proving the thesis with the same poem twice.",
    criteria: "Song sharing 100% lyrical content with another track on same album, with distinct production proving prompt-as-authorship thesis.",
  },
  {
    trackNum: 6,
    song: "Already True",
    badgeName: "No Robots Were Harmed",
    primaryArtist: "jeff",
    description: "100% human. Every word. The album's soul. Badge earned: all-human creative work in an AI-assisted album.",
    criteria: "Song with verified 100% human authorship (no AI generation) in an album that includes AI-assisted tracks.",
  },
  {
    trackNum: 7,
    song: "Pop Song Summer",
    badgeName: "The Child That Became the Parent",
    primaryArtist: "jeff",
    description: "Its derivative's prompt became the Devco sound template. The child's DNA defined the parent's identity. Badge earned: reverse genealogy.",
    criteria: "Song whose derivative work's prompt was adopted as the project's defining creative template.",
  },
  {
    trackNum: 8,
    song: "Intimate Restraint",
    badgeName: "Genre Is Authorship",
    primaryArtist: "jeff",
    description: "Same words, different genre prompt, completely different meaning. The genre choice IS the creative decision. Badge earned: proving genre as authorship.",
    criteria: "Song with multiple genre iterations documented, demonstrating that prompt/genre selection constitutes creative authorship.",
  },
  {
    trackNum: 9,
    song: "Let's Stay This Way",
    badgeName: "The Cathedral",
    primaryArtist: "jeff",
    description: "Written January 4th before any of this existed. The song the album grew around. Badge earned: origin point, placed at the center not the beginning.",
    criteria: "Song predating project inception that became the titular track, with non-sequential placement demonstrating intentional structural decision.",
  },
  {
    trackNum: 10,
    song: "Flowin",
    badgeName: "The Process Watching Itself",
    primaryArtist: "jeff",
    description: "Meta-track. The process reflecting on its own creation. Badge earned: recursive self-awareness.",
    criteria: "Meta-song about the creative process, with documented accidental contribution (truncated prompt) that improved the work.",
  },
  {
    trackNum: 11,
    song: "Christmas Time",
    badgeName: "Wrong Season, Right Feeling",
    primaryArtist: "jeff",
    description: "A Christmas song that doesn't need December. Warmth before the end. Badge earned: seasonal defiance.",
    criteria: "Seasonal song with out-of-season placement decision documented, demonstrating thematic use over calendar requirement.",
  },
  {
    trackNum: 12,
    song: "Sounds Like Heaven Revisited",
    badgeName: "The Ouroboros Badge",
    primaryArtist: "jeff",
    description: "Full circle. Same words as Track 2 and 5, their third appearance. Acoustic, quiet, stripped. Badge earned: transformation through repetition.",
    criteria: "Song completing a lyrical trilogy within a single album, with placement demonstrating intentional circular structure.",
  },
];

// ═══════════════════════════════════════════════════════════════
// Hedera Client Setup
// ═══════════════════════════════════════════════════════════════

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;
const network = process.env.HEDERA_NETWORK || "testnet";

if (!operatorId || !operatorKey) {
  console.error("⚠️  HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be set in .env");
  process.exit(1);
}

const client = network === "mainnet" ? Client.forMainnet() : Client.forTestnet();
const privateKey = operatorKey.startsWith("0x")
  ? PrivateKey.fromStringECDSA(operatorKey)
  : PrivateKey.fromStringED25519(operatorKey);
client.setOperator(operatorId, privateKey);

// Load sentinel
let sentinelState = null;
if (fs.existsSync(SENTINEL_PATH)) {
  sentinelState = JSON.parse(fs.readFileSync(SENTINEL_PATH, "utf-8"));
  console.log(`🛡️  Sentinel DID loaded: ${sentinelState.did.slice(0, 60)}...`);
} else {
  console.error("❌ No .sentinel.json found. Run the server first to create sentinel.");
  process.exit(1);
}

// ═══════════════════════════════════════════════════════════════
// Helper: submit message to topic with chunking
// ═══════════════════════════════════════════════════════════════

async function submitToTopic(topicId, messageObj) {
  const json = JSON.stringify(messageObj);
  if (json.length <= 1024) {
    await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(json)
      .execute(client);
  } else {
    const CHUNK_SIZE = 700;
    const totalChunks = Math.ceil(json.length / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(
          JSON.stringify({ _chunk: true, index: i, total: totalChunks, data: chunk })
        )
        .execute(client);
      if (i < totalChunks - 1) await new Promise((r) => setTimeout(r, 500));
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// Issue a single badge
// ═══════════════════════════════════════════════════════════════

async function issueBadge(badge) {
  const songTopicId = SONG_TOPICS[badge.song];
  const artistDid = ARTIST_DIDS[badge.primaryArtist];
  const artistTopicId = ARTIST_TOPICS[badge.primaryArtist];

  if (!songTopicId) {
    throw new Error(`No topic found for song: ${badge.song}`);
  }

  const vcId = `urn:uuid:${crypto.randomUUID()}`;
  const now = new Date().toISOString();

  const badgeVC = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      "https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json",
    ],
    id: vcId,
    type: ["VerifiableCredential", "AchievementCredential"],
    issuer: {
      id: sentinelState.did,
      type: "Profile",
      name: "Provenance Studio",
    },
    validFrom: now,
    credentialSubject: {
      type: "AchievementSubject",
      id: artistDid,
      achievement: {
        type: "Achievement",
        name: badge.badgeName,
        description: badge.description,
        criteria: {
          narrative: badge.criteria,
        },
      },
    },
    evidence: [
      {
        id: `https://hashscan.io/testnet/topic/${songTopicId}`,
        type: "Evidence",
        name: "Hedera Provenance Chain",
      },
    ],
  };

  // Sign with dual proof
  const badgePayload = JSON.stringify(badgeVC);
  const badgeHash = crypto.createHash("sha256").update(badgePayload).digest();
  const signatureBytes = privateKey.sign(badgeHash);
  const signatureHex = Buffer.from(signatureBytes).toString("hex");

  badgeVC.proof = [
    {
      type: "EcdsaSecp256k1Signature2019",
      created: now,
      proofPurpose: "assertionMethod",
      verificationMethod: `${artistDid}#key-1`,
      proofValue: signatureHex,
    },
    {
      type: "EcdsaSecp256k1Signature2019",
      created: now,
      proofPurpose: "authentication",
      verificationMethod: `${sentinelState.did}#did-root-key`,
      proofValue: signatureHex,
    },
  ];

  // Submit to song topic
  await submitToTopic(songTopicId, {
    type: "AchievementCredential",
    credential: badgeVC,
  });

  // Also submit to artist topic
  await submitToTopic(artistTopicId, {
    type: "AchievementCredential",
    credential: badgeVC,
  });

  return {
    vcId,
    songTopicId,
    artistTopicId,
    badgeName: badge.badgeName,
    song: badge.song,
    recipient: badge.primaryArtist,
  };
}

// ═══════════════════════════════════════════════════════════════
// Main: Issue all 12 badges
// ═══════════════════════════════════════════════════════════════

async function main() {
  console.log(`
═══════════════════════════════════════════════════════════════
  🏆 ALBUM BADGE REPLAY — "LET'S STAY THIS WAY"
  Issuing all 12 track badges as OB3 AchievementCredentials
═══════════════════════════════════════════════════════════════
`);

  const results = [];
  const startTime = Date.now();
  let successCount = 0;

  for (const badge of ALBUM_BADGES) {
    try {
      console.log(`🎵 Track ${badge.trackNum}: "${badge.song}"`);
      console.log(`   Badge: "${badge.badgeName}"`);
      
      const result = await issueBadge(badge);
      results.push({ ...result, status: "success" });
      successCount++;
      
      console.log(`   ✅ Issued to ${result.recipient} on topic ${result.songTopicId}`);
      console.log(`   VC ID: ${result.vcId}`);
      console.log();

      // Small delay between badges
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
      results.push({
        badgeName: badge.badgeName,
        song: badge.song,
        status: "failed",
        error: err.message,
      });
    }
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const estimatedCost = successCount * 0.002;

  // Summary
  console.log(`
═══════════════════════════════════════════════════════════════
  📊 BADGE REPLAY SUMMARY
═══════════════════════════════════════════════════════════════

   Badges issued: ${successCount} / 12
   Estimated cost: ~$${estimatedCost.toFixed(4)}
   Time elapsed: ${elapsed}s
   Album topic: ${ALBUM_TOPIC}

   Song Topics with Badges:
`);

  for (const result of results) {
    if (result.status === "success") {
      console.log(`   • ${result.song}: ${result.songTopicId}`);
      console.log(`     https://hashscan.io/testnet/topic/${result.songTopicId}`);
    }
  }

  console.log(`
═══════════════════════════════════════════════════════════════
`);

  // Write results to file
  const output = `
═══════════════════════════════════════════════════════════════
  🏆 ALBUM BADGE REPLAY RESULTS
  ${new Date().toISOString()}
═══════════════════════════════════════════════════════════════

Badges Issued: ${successCount} / 12
Estimated Cost: ~$${estimatedCost.toFixed(4)}
Time Elapsed: ${elapsed}s

Album Topic: ${ALBUM_TOPIC}
https://hashscan.io/testnet/topic/${ALBUM_TOPIC}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  INDIVIDUAL BADGE RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${results.map((r, i) => {
  if (r.status === "success") {
    return `Track ${i + 1}: "${r.song}"
   Badge: "${r.badgeName}"
   Recipient: ${r.recipient}
   VC ID: ${r.vcId}
   Song Topic: ${r.songTopicId}
   Artist Topic: ${r.artistTopicId}
   Status: ✅ Success
`;
  } else {
    return `Track ${i + 1}: "${r.song}"
   Badge: "${r.badgeName}"
   Status: ❌ Failed
   Error: ${r.error}
`;
  }
}).join("\n")}

═══════════════════════════════════════════════════════════════
`;

  fs.writeFileSync(RESULTS_PATH, output);
  console.log(`📝 Results saved to ${RESULTS_PATH}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
