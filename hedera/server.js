// Hedera Consensus Service (HCS) microservice
// Runs alongside the Rails app on port 3335
// Provides REST endpoints for creating topics and submitting/reading messages

import "dotenv/config";
import express from "express";
import {
  Client,
  TopicCreateTransaction,
  TopicMessageSubmitTransaction,
  PrivateKey,
} from "@hashgraph/sdk";

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

// --- Routes ---

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

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", network, operatorId });
});

// --- Start ---

const PORT = process.env.PORT || 3335;
app.listen(PORT, () => {
  console.log(`🚀 Hedera HCS service running on http://localhost:${PORT}`);
  console.log(`   Network: ${network} | Operator: ${operatorId}`);
});
