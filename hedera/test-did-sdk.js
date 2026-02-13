// Spike test: Hiero DID SDK integration
import "dotenv/config";
import { Client, PrivateKey } from "@hashgraph/sdk";
import { createDID } from "@hiero-did-sdk/registrar";
import { resolveDID } from "@hiero-did-sdk/resolver";

const operatorId = process.env.HEDERA_OPERATOR_ID;
const operatorKey = process.env.HEDERA_OPERATOR_KEY;

const client = Client.forTestnet();
const privateKey = operatorKey.startsWith("0x")
  ? PrivateKey.fromStringECDSA(operatorKey)
  : PrivateKey.fromStringED25519(operatorKey);
client.setOperator(operatorId, privateKey);

async function main() {
  console.log("🔑 Operator:", operatorId);
  console.log("🔑 Key type:", operatorKey.startsWith("0x") ? "ECDSA" : "ED25519");
  
  // Step 1: Create a DID using the SDK
  console.log("\n📝 Creating DID via Hiero DID SDK...");
  try {
    const result = await createDID({ client });
    console.log("✅ DID created:", result.did);
    console.log("📄 DID Document:", JSON.stringify(result.didDocument, null, 2));

    // Step 2: Resolve it back
    console.log("\n🔍 Resolving DID...");
    const resolved = await resolveDID(result.did);
    console.log("✅ Resolved:", JSON.stringify(resolved, null, 2));
  } catch (err) {
    console.error("❌ Error:", err.message);
    console.error(err.stack);
  }

  client.close();
}

main();
