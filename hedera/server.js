// Hedera Consensus Service (HCS) microservice
// Runs alongside the Rails app on port 3335
// Provides REST endpoints for creating topics and submitting/reading messages

import "dotenv/config";
import express from "express";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  PrivateKey,
} from "@hashgraph/sdk";

process.on('uncaughtException', (err) => { console.error('⚠️ Uncaught:', err.message); });
process.on('unhandledRejection', (err) => { console.error('⚠️ Unhandled rejection:', err.message || err); });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SENTINEL_PATH = path.join(__dirname, ".sentinel.json");

const app = express();
app.use(express.json());

// --- Hedera Client Setup ---

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;
const network = process.env.HEDERA_NETWORK || "testnet";

if (!operatorId || !operatorKey) {
  console.error("⚠️  HEDERA_OPERATOR_ID and HEDERA_OPERATOR_KEY must be set in .env");
  console.error("   Get testnet credentials at https://portal.hedera.com/faucet");
  process.exit(1);
}

const client =
  network === "mainnet" ? Client.forMainnet() : Client.forTestnet();

// Support both ECDSA (0x-prefixed hex) and ED25519 key formats
const privateKey = operatorKey.startsWith("0x")
  ? PrivateKey.fromStringECDSA(operatorKey)
  : PrivateKey.fromStringED25519(operatorKey);
client.setOperator(operatorId, privateKey);

// Mirror node base URL for reading messages
const MIRROR_BASE =
  network === "mainnet"
    ? "https://mainnet.mirrornode.hedera.com"
    : "https://testnet.mirrornode.hedera.com";

// --- Sentinel DID (Platform Identity) ---

let sentinelState = null; // { did, topicId, didDocument }

async function initSentinel() {
  // Check if sentinel already exists on disk
  if (fs.existsSync(SENTINEL_PATH)) {
    try {
      sentinelState = JSON.parse(fs.readFileSync(SENTINEL_PATH, "utf-8"));
      console.log(`🛡️  Sentinel DID loaded: ${sentinelState.did}`);
      return;
    } catch (e) {
      console.warn("⚠️  Corrupt .sentinel.json, recreating...");
    }
  }

  // Create a new sentinel DID
  console.log("🛡️  Creating Sentinel DID (platform identity)...");
  const tx = new TopicCreateTransaction().setTopicMemo("DID:sentinel:ProvenanceStudio");
  const response = await tx.execute(client);
  const receipt = await response.getReceipt(client);
  const topicId = receipt.topicId.toString();

  const publicKeyHex = privateKey.publicKey.toStringRaw();
  const did = `did:hedera:testnet:${publicKeyHex}_${topicId}`;

  const didDocument = {
    "@context": "https://www.w3.org/ns/did/v1",
    id: did,
    controller: did,
    verificationMethod: [
      {
        id: `${did}#did-root-key`,
        type: "EcdsaSecp256k1VerificationKey2019",
        controller: did,
        publicKeyHex: publicKeyHex,
      },
    ],
    authentication: [`${did}#did-root-key`],
    service: [
      {
        id: `${did}#platform`,
        type: "PlatformIdentity",
        serviceEndpoint: {
          name: "Provenance Studio",
          description: "Sentinel identity for platform-attested verifiable credentials",
          createdAt: new Date().toISOString(),
        },
      },
    ],
  };

  // Submit DID document to the topic
  await submitToTopic(topicId, { type: "DIDDocument", ...didDocument });

  sentinelState = { did, topicId, didDocument };
  fs.writeFileSync(SENTINEL_PATH, JSON.stringify(sentinelState, null, 2));
  console.log(`🛡️  Sentinel DID created: ${did} (topic: ${topicId})`);
}

// --- Routes ---

// GET /sentinel — Return the sentinel DID and document
app.get("/sentinel", (_req, res) => {
  if (!sentinelState) {
    return res.status(503).json({ error: "Sentinel DID not yet initialized" });
  }
  res.json({
    did: sentinelState.did,
    topicId: sentinelState.topicId,
    didDocument: sentinelState.didDocument,
  });
});

// POST /topics — Create a new HCS topic
// Body: { memo: "optional memo" }
// Returns: { topicId: "0.0.xxxxx" }
app.post("/topics", async (req, res) => {
  try {
    const { memo } = req.body || {};
    const tx = new TopicCreateTransaction();
    if (memo) tx.setTopicMemo(memo);

    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);
    const topicId = receipt.topicId.toString();

    console.log(`✅ Created topic: ${topicId}`);
    res.json({ topicId });
  } catch (err) {
    console.error("❌ Create topic error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /topics/:topicId/messages — Submit a message to a topic
// Body: any JSON (will be stringified and submitted)
// Returns: { sequenceNumber, timestamp }
app.post("/topics/:topicId/messages", async (req, res) => {
  try {
    const { topicId } = req.params;
    const message = JSON.stringify(req.body);

    const response = await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(message)
      .execute(client);

    const receipt = await response.getReceipt(client);

    console.log(`✅ Message submitted to ${topicId}, seq: ${receipt.topicSequenceNumber}`);
    res.json({
      sequenceNumber: receipt.topicSequenceNumber.toString(),
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("❌ Submit message error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /topics/:topicId/messages — Read messages from a topic via Mirror Node
// Returns: array of decoded messages
app.get("/topics/:topicId/messages", async (req, res) => {
  try {
    const { topicId } = req.params;
    const url = `${MIRROR_BASE}/api/v1/topics/${topicId}/messages`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mirror node returned ${response.status}`);
    }

    const data = await response.json();

    // Decode base64 messages
    const messages = (data.messages || []).map((m) => ({
      sequenceNumber: m.sequence_number,
      timestamp: m.consensus_timestamp,
      message: JSON.parse(
        Buffer.from(m.message, "base64").toString("utf-8")
      ),
    }));

    res.json(messages);
  } catch (err) {
    console.error("❌ Get messages error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// --- Helper: submit a message to a topic, chunking if > 1024 bytes ---
async function submitToTopic(topicId, messageObj) {
  const json = JSON.stringify(messageObj);
  if (json.length <= 1024) {
    await new TopicMessageSubmitTransaction()
      .setTopicId(topicId)
      .setMessage(json)
      .execute(client);
  } else {
    const CHUNK_SIZE = 700; // keep well under 1024 after JSON wrapper overhead
    const totalChunks = Math.ceil(json.length / CHUNK_SIZE);
    for (let i = 0; i < totalChunks; i++) {
      const chunk = json.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      await new TopicMessageSubmitTransaction()
        .setTopicId(topicId)
        .setMessage(
          JSON.stringify({ _chunk: true, index: i, total: totalChunks, data: chunk })
        )
        .execute(client);
      if (i < totalChunks - 1) await new Promise(r => setTimeout(r, 500));
    }
  }
}

// --- DID / Verifiable Credential Routes ---

// POST /artists — Register an artist DID
// Body: { name: "Artist Name", influences: [] }
// Returns: { did, topicId, didDocument }
app.post("/artists", async (req, res) => {
  try {
    const { name, influences } = req.body || {};

    // Create a dedicated HCS topic for this artist's DID
    const tx = new TopicCreateTransaction().setTopicMemo(
      `DID:artist:${name || "unknown"}`
    );
    const response = await tx.execute(client);
    const receipt = await response.getReceipt(client);
    const topicId = receipt.topicId.toString();

    // Build the DID string: did:hedera:testnet:{publicKey}_{topicId}
    const publicKeyHex = privateKey.publicKey.toStringRaw();
    const did = `did:hedera:testnet:${publicKeyHex}_${topicId}`;

    // Construct a minimal DID document
    const didDocument = {
      "@context": "https://www.w3.org/ns/did/v1",
      id: did,
      controller: did,
      verificationMethod: [
        {
          id: `${did}#key-1`,
          type: "EcdsaSecp256k1VerificationKey2019",
          controller: did,
          publicKeyHex: publicKeyHex,
        },
      ],
      authentication: [`${did}#key-1`],
      service: [
        {
          id: `${did}#artist-profile`,
          type: "ArtistProfile",
          serviceEndpoint: {
            name: name || "Unknown Artist",
            influences: influences || [],
            registeredAt: new Date().toISOString(),
          },
        },
      ],
    };

    // Submit DID document to the topic (with auto-chunking for >1024 byte messages)
    await submitToTopic(topicId, { type: "DIDDocument", ...didDocument });

    console.log(`✅ Registered artist DID: ${did} (topic: ${topicId})`);
    res.json({ did, topicId, didDocument });
  } catch (err) {
    console.error("❌ Register artist error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET /artists/:topicId/did — Resolve an artist DID from their topic
app.get("/artists/:topicId/did", async (req, res) => {
  try {
    const { topicId } = req.params;
    const url = `${MIRROR_BASE}/api/v1/topics/${topicId}/messages?order=asc&limit=10`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Mirror node returned ${response.status}`);
    }

    const data = await response.json();
    if (!data.messages || data.messages.length === 0) {
      return res.status(404).json({ error: "No DID document found on this topic" });
    }

    // Try to find a complete DID document or reassemble chunks
    const firstMsg = JSON.parse(
      Buffer.from(data.messages[0].message, "base64").toString("utf-8")
    );

    if (firstMsg.type === "DIDDocument") {
      // Complete document in one message
      res.json(firstMsg);
    } else if (firstMsg._chunk) {
      // Reassemble chunked message
      const chunks = [];
      for (const m of data.messages) {
        const parsed = JSON.parse(
          Buffer.from(m.message, "base64").toString("utf-8")
        );
        if (parsed._chunk) {
          chunks[parsed.index] = parsed.data;
        }
      }
      const reassembled = JSON.parse(chunks.join(""));
      res.json(reassembled);
    } else {
      res.status(404).json({ error: "No DID document found on this topic" });
    }
  } catch (err) {
    console.error("❌ Resolve DID error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /credentials — Issue a Verifiable Credential (provenance certificate)
// Body: { issuerDid, issuerTopicId, songTitle, songTopicId, masterHash, artifacts[], contributionCount, creators[] }
// creators is optional: [{ did, role, share }] — shares must sum to 100
// Returns: the full signed VC JSON with dual proof (issuer + sentinel)
app.post("/credentials", async (req, res) => {
  try {
    const {
      issuerDid,
      issuerTopicId,
      songTitle,
      songTopicId,
      masterHash,
      artifacts,
      contributionCount,
      creators,
    } = req.body;

    if (!issuerDid || !songTopicId) {
      return res.status(400).json({ error: "issuerDid and songTopicId are required" });
    }

    // Validate creators shares if provided
    let resolvedCreators = null;
    if (creators && creators.length > 0) {
      const totalShares = creators.reduce((sum, c) => sum + (c.share || 0), 0);
      if (totalShares !== 100) {
        return res.status(400).json({
          error: `Creator shares must sum to 100, got ${totalShares}`,
        });
      }
      resolvedCreators = creators;
    } else {
      // Default: single creator with 100% share
      resolvedCreators = [{ did: issuerDid, role: "artist", share: 100 }];
    }

    // Build the W3C Verifiable Credential
    const vcId = `urn:uuid:${crypto.randomUUID()}`;
    const vc = {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://www.w3.org/2018/credentials/examples/v1",
      ],
      id: vcId,
      type: ["VerifiableCredential", "ProvenanceCredential"],
      issuer: issuerDid,
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: `hedera:testnet:topic:${songTopicId}`,
        type: "CreativeWork",
        title: songTitle || "Untitled",
        creators: resolvedCreators,
        provenanceChain: {
          network: "testnet",
          topicId: songTopicId,
          hashscanUrl: `https://hashscan.io/testnet/topic/${songTopicId}`,
          contributionCount: contributionCount || 0,
        },
        artifacts: artifacts || [],
        masterHash: masterHash || null,
      },
    };

    // Sign the VC with ECDSA operator key (issuer signature)
    const vcPayload = JSON.stringify(vc);
    const vcHash = crypto.createHash("sha256").update(vcPayload).digest();
    const issuerSignatureBytes = privateKey.sign(vcHash);
    const issuerSignatureHex = Buffer.from(issuerSignatureBytes).toString("hex");

    const now = new Date().toISOString();

    // Build dual proof array: issuer + sentinel
    const proofs = [
      {
        type: "EcdsaSecp256k1Signature2019",
        created: now,
        verificationMethod: `${issuerDid}#key-1`,
        proofPurpose: "assertionMethod",
        proofValue: issuerSignatureHex,
      },
    ];

    // Add sentinel co-signature if sentinel is initialized
    if (sentinelState) {
      const sentinelSignatureBytes = privateKey.sign(vcHash); // sentinel key IS operator key
      const sentinelSignatureHex = Buffer.from(sentinelSignatureBytes).toString("hex");
      proofs.push({
        type: "EcdsaSecp256k1Signature2019",
        created: now,
        verificationMethod: `${sentinelState.did}#did-root-key`,
        proofPurpose: "authentication",
        proofValue: sentinelSignatureHex,
      });
    }

    vc.proof = proofs;

    // Submit VC to the song's topic (with chunking support)
    await submitToTopic(songTopicId, { type: "VerifiableCredential", credential: vc });

    // Also submit to the artist's topic if provided
    if (issuerTopicId) {
      await submitToTopic(issuerTopicId, { type: "VerifiableCredential", credential: vc });
    }

    console.log(`✅ Issued VC ${vcId} for "${songTitle}" with ${resolvedCreators.length} creator(s)`);
    res.json(vc);
  } catch (err) {
    console.error("❌ Issue credential error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST /credentials/verify — Verify a Verifiable Credential
// Body: the full VC JSON
// Returns: { valid, checks[] }
app.post("/credentials/verify", async (req, res) => {
  try {
    const vc = req.body;
    const checks = [];

    // 1. Check structure
    if (!vc || !vc.proof || !vc.issuer || !vc.credentialSubject) {
      return res.json({ valid: false, checks: [{ name: "structure", passed: false, detail: "Missing required VC fields" }] });
    }
    checks.push({ name: "structure", passed: true, detail: "VC has required fields" });

    // 2. Check creators shares sum to 100
    const creators = vc.credentialSubject.creators;
    if (creators && creators.length > 0) {
      const total = creators.reduce((sum, c) => sum + (c.share || 0), 0);
      const sharesOk = total === 100;
      checks.push({ name: "creator_shares", passed: sharesOk, detail: `Shares sum to ${total}` });
      if (!sharesOk) {
        return res.json({ valid: false, checks });
      }
    } else {
      checks.push({ name: "creator_shares", passed: true, detail: "No explicit creators (single issuer assumed)" });
    }

    // 3. Verify signatures
    // Extract VC without proof for hash verification
    const { proof, ...vcWithoutProof } = vc;
    const vcPayload = JSON.stringify(vcWithoutProof);
    const vcHash = crypto.createHash("sha256").update(vcPayload).digest();

    const proofs = Array.isArray(proof) ? proof : [proof];

    for (const p of proofs) {
      const sigBytes = Buffer.from(p.proofValue, "hex");
      const publicKeyHex = privateKey.publicKey.toStringRaw();

      // Verify using the operator's public key (in this demo, all keys are the operator key)
      const verified = privateKey.publicKey.verify(vcHash, sigBytes);

      const sigType = p.proofPurpose === "authentication" ? "sentinel" : "issuer";
      checks.push({
        name: `signature_${sigType}`,
        passed: verified,
        detail: `${sigType} signature (${p.verificationMethod}) ${verified ? "valid" : "invalid"}`,
      });
    }

    // 4. Check sentinel attestation
    const hasSentinelProof = proofs.some((p) => p.proofPurpose === "authentication");
    checks.push({
      name: "sentinel_attestation",
      passed: hasSentinelProof,
      detail: hasSentinelProof
        ? "Sentinel co-signature present"
        : "No sentinel co-signature found",
    });

    const allPassed = checks.every((c) => c.passed);
    res.json({ valid: allPassed, checks });
  } catch (err) {
    console.error("❌ Verify credential error:", err.message);
    res.status(500).json({ error: err.message, valid: false, checks: [] });
  }
});

// Health check
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    network,
    operatorId,
    sentinel: sentinelState ? { did: sentinelState.did, topicId: sentinelState.topicId } : null,
  });
});

// --- Start ---

const PORT = process.env.PORT || 3335;
app.listen(PORT, async () => {
  console.log(`🚀 Hedera HCS service running on http://localhost:${PORT}`);
  console.log(`   Network: ${network} | Operator: ${operatorId}`);

  // Initialize sentinel DID on startup
  try {
    await initSentinel();
  } catch (err) {
    console.error("❌ Sentinel initialization failed:", err.message);
    console.error("   Service will continue without sentinel co-signing");
  }
});
