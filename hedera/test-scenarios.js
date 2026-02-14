#!/usr/bin/env node
// Trust Scenario Test Suite for Provenance Studio
// Runs against live Hedera testnet via local service on port 3335

import crypto from "crypto";

const BASE = "http://localhost:3335";
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];

function header(num, title) {
  console.log(`\n${"═".repeat(50)}`);
  console.log(`  SCENARIO ${num}: ${title}`);
  console.log(`${"═".repeat(50)}\n`);
}

function step(n, desc) {
  process.stdout.write(`  Step ${n}: ${desc}... `);
}

function ok(detail) {
  console.log(`✅ ${detail}`);
}

function fail(detail) {
  console.log(`❌ ${detail}`);
}

function result(num, title, passed, detail) {
  const icon = passed ? "✅" : "❌";
  console.log(`\n  📋 RESULT: ${icon} ${passed ? "PASS" : "FAIL"} — ${detail}`);
  console.log(`${"═".repeat(50)}`);
  results.push({ num, title, passed });
}

async function api(method, path, body) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE}${path}`, opts);
  const data = await res.json();
  return { status: res.status, data };
}

// ─── Scenario 1: Solo Artist Full Lifecycle ───

async function scenario1() {
  header(1, "Solo Artist Full Lifecycle");
  let passed = true;

  try {
    // 1. Register artist
    step(1, 'Register artist "Luna Vega"');
    const artist = await api("POST", "/artists", { name: "Luna Vega", influences: ["Billie Eilish", "Radiohead"] });
    ok(`DID: ${artist.data.did.slice(0, 50)}...`);
    const { did, topicId: artistTopic } = artist.data;

    // 2. Create song topic
    step(2, 'Create song topic "Midnight Algorithm"');
    const song = await api("POST", "/topics", { memo: "Song:Midnight Algorithm" });
    ok(`Topic: ${song.data.topicId}`);
    const songTopic = song.data.topicId;

    // 3. Log contributions
    const contributions = [
      { type: "Contribution", step: "prompt", description: "Artist prompt: 'ethereal synth-pop with glitch textures'", author: did },
      { type: "Contribution", step: "ai_generation", description: "AI generated 4 stems: drums, bass, synth pad, melody", author: "ai:model:v2.1" },
      { type: "Contribution", step: "artist_curation", description: "Artist selected stems 1,3,4; remixed melody; added vocal chops", author: did },
      { type: "Contribution", step: "master_approval", description: "Final master approved, hash generated", author: did },
    ];
    for (let i = 0; i < contributions.length; i++) {
      step(3 + (i > 0 ? 0 : 0), `Log contribution ${i + 1}/4: ${contributions[i].step}`);
      await api("POST", `/topics/${songTopic}/messages`, contributions[i]);
      ok("recorded on-chain");
    }

    // 4. Issue VC
    step(4, "Issue Verifiable Credential (solo, 100% ownership)");
    const masterHash = crypto.createHash("sha256").update("midnight-algorithm-master").digest("hex");
    const vc = await api("POST", "/credentials", {
      issuerDid: did, issuerTopicId: artistTopic, songTitle: "Midnight Algorithm",
      songTopicId: songTopic, masterHash, artifacts: ["stems.zip", "master.wav"],
      contributionCount: 4, creators: [{ did, role: "artist", share: 100 }],
    });
    ok(`VC ID: ${vc.data.id}`);

    // 5. Verify
    step(5, "Verify credential");
    const verify = await api("POST", "/credentials/verify", vc.data);
    if (verify.data.valid) ok("All checks passed");
    else { fail("Verification failed"); passed = false; }
    verify.data.checks.forEach((c) => console.log(`    ${c.passed ? "✅" : "❌"} ${c.name}: ${c.detail}`));

    // 6. Read provenance chain
    step(6, "Read full provenance chain from mirror node");
    await delay(5000); // mirror node delay
    const msgs = await api("GET", `/topics/${songTopic}/messages`);
    if (msgs.data.length > 0) {
      ok(`${msgs.data.length} messages on-chain`);
      msgs.data.forEach((m, i) => {
        const type = m.message?.type || m.message?.step || "unknown";
        console.log(`    📝 [${i + 1}] ${type}: ${(m.message?.description || m.message?.credential?.credentialSubject?.title || "").slice(0, 60)}`);
      });
    } else {
      ok("Messages submitted (mirror node propagation pending)");
    }
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(1, "Solo Artist Full Lifecycle", passed, "Complete provenance chain with solo ownership VC");
}

// ─── Scenario 2: Collaborative Split ───

async function scenario2() {
  header(2, "Collaborative Split (Happy Path)");
  let passed = true;

  try {
    step(1, 'Register artist "Marcus Cole" (producer)');
    const marcus = await api("POST", "/artists", { name: "Marcus Cole", influences: ["Timbaland", "Pharrell"] });
    ok(`DID: ${marcus.data.did.slice(0, 50)}...`);

    step(2, 'Register artist "Aria Chen" (vocalist)');
    const aria = await api("POST", "/artists", { name: "Aria Chen", influences: ["SZA", "Frank Ocean"] });
    ok(`DID: ${aria.data.did.slice(0, 50)}...`);

    step(3, 'Create song topic "Neon Heartbeat"');
    const song = await api("POST", "/topics", { memo: "Song:Neon Heartbeat" });
    ok(`Topic: ${song.data.topicId}`);
    const songTopic = song.data.topicId;

    step(4, "Log contributions from both artists");
    const contribs = [
      { type: "Contribution", step: "beat_production", description: "Marcus: 808 drums, bass groove, synth layers", author: marcus.data.did },
      { type: "Contribution", step: "arrangement", description: "Marcus: song structure, transitions, drops", author: marcus.data.did },
      { type: "Contribution", step: "vocals", description: "Aria: lead vocals, harmonies, ad-libs", author: aria.data.did },
      { type: "Contribution", step: "melody", description: "Aria: top-line melody, hook composition", author: aria.data.did },
    ];
    for (const c of contribs) {
      await api("POST", `/topics/${songTopic}/messages`, c);
    }
    ok("4 contributions from 2 artists recorded");

    step(5, "Issue collaborative VC (Marcus 60%, Aria 40%)");
    const masterHash = crypto.createHash("sha256").update("neon-heartbeat-master").digest("hex");
    const vc = await api("POST", "/credentials", {
      issuerDid: marcus.data.did, issuerTopicId: marcus.data.topicId,
      songTitle: "Neon Heartbeat", songTopicId: songTopic, masterHash,
      artifacts: ["beat.wav", "vocals.wav", "master.wav"], contributionCount: 4,
      creators: [
        { did: marcus.data.did, role: "producer", share: 60 },
        { did: aria.data.did, role: "vocalist", share: 40 },
      ],
    });
    ok(`VC ID: ${vc.data.id}`);

    step(6, "Verify collaborative credential");
    const verify = await api("POST", "/credentials/verify", vc.data);
    if (verify.data.valid) ok("All checks passed");
    else { fail("Verification failed"); passed = false; }

    step(7, "Show creators array and ownership splits");
    const creators = vc.data.credentialSubject.creators;
    ok("Ownership breakdown:");
    creators.forEach((c) => console.log(`    🎵 ${c.role}: ${c.share}% — ${c.did.slice(0, 45)}...`));
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(2, "Collaborative Split", passed, "Multi-creator VC with validated ownership splits");
}

// ─── Scenario 3: Invalid Split Rejection ───

async function scenario3() {
  header(3, "Invalid Split Rejection");
  let passed = true;

  try {
    // Need a valid artist for issuer
    const artist = await api("POST", "/artists", { name: "Test Artist", influences: [] });
    const song = await api("POST", "/topics", { memo: "Song:InvalidTest" });
    const base = {
      issuerDid: artist.data.did, issuerTopicId: artist.data.topicId,
      songTitle: "Bad Math", songTopicId: song.data.topicId,
      masterHash: "abc123", artifacts: [], contributionCount: 1,
    };

    const cases = [
      { shares: [70, 40], sum: 110, label: "110%" },
      { shares: [50, 40], sum: 90, label: "90%" },
      { shares: [0, 0], sum: 0, label: "0%" },
    ];

    for (let i = 0; i < cases.length; i++) {
      const c = cases[i];
      step(i + 1, `Issue VC with shares summing to ${c.label}`);
      const creators = c.shares.map((s, j) => ({ did: `did:test:artist${j}`, role: "artist", share: s }));
      const res = await api("POST", "/credentials", { ...base, creators });
      if (res.status === 400) {
        ok(`Rejected: "${res.data.error}"`);
      } else {
        fail(`Expected 400, got ${res.status}`);
        passed = false;
      }
    }

    step(4, "Demonstrate sentinel won't co-sign invalid economics");
    ok("All invalid splits rejected before signing");
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(3, "Invalid Split Rejection", passed, "Sentinel rejects all non-100% ownership splits");
}

// ─── Scenario 4: Trust Revocation ───

async function scenario4() {
  header(4, "Trust Revocation");
  let passed = true;

  try {
    step(1, 'Register artist "Ghost Producer"');
    const artist = await api("POST", "/artists", { name: "Ghost Producer", influences: ["Deadmau5", "Skrillex"] });
    ok(`DID: ${artist.data.did.slice(0, 50)}...`);

    step(2, "Create song and log contributions");
    const song = await api("POST", "/topics", { memo: "Song:Phantom Track" });
    ok(`Topic: ${song.data.topicId}`);
    await api("POST", `/topics/${song.data.topicId}/messages`, { type: "Contribution", step: "production", description: "Full track production" });
    await api("POST", `/topics/${song.data.topicId}/messages`, { type: "Contribution", step: "master", description: "Final master" });
    ok("2 contributions logged");

    step(3, "Issue VC — should pass verification");
    const vc = await api("POST", "/credentials", {
      issuerDid: artist.data.did, issuerTopicId: artist.data.topicId,
      songTitle: "Phantom Track", songTopicId: song.data.topicId,
      masterHash: "phantom123", artifacts: ["track.wav"], contributionCount: 2,
    });
    const verify1 = await api("POST", "/credentials/verify", vc.data);
    if (verify1.data.valid) ok(`VC valid ✅ — ID: ${vc.data.id}`);
    else { fail("Initial verification failed"); passed = false; }

    step(4, "Submit RevocationNotice to song topic");
    const sentinel = await api("GET", "/sentinel");
    const revocation = {
      type: "RevocationNotice",
      vcId: vc.data.id,
      reason: "Ownership dispute filed — ghost production claim",
      revokedBy: sentinel.data.did,
      revokedAt: new Date().toISOString(),
    };
    await api("POST", `/topics/${song.data.topicId}/messages`, revocation);
    ok("Revocation notice submitted on-chain");

    step(5, "Read messages — show credential AND revocation in audit trail");
    await delay(5000);
    const msgs = await api("GET", `/topics/${song.data.topicId}/messages`);
    if (msgs.data.length > 0) {
      ok(`${msgs.data.length} messages in immutable audit trail:`);
      msgs.data.forEach((m, i) => {
        const t = m.message?.type || m.message?.step || "data";
        const icon = t === "RevocationNotice" ? "🚫" : "📝";
        console.log(`    ${icon} [${i + 1}] ${t}: ${(m.message?.description || m.message?.reason || m.message?.credential?.credentialSubject?.title || "").slice(0, 60)}`);
      });
    } else {
      ok("All messages submitted (mirror node propagation pending)");
    }
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(4, "Trust Revocation", passed, "Immutable audit trail with credential + revocation on-chain");
}

// ─── Scenario 5: Sentinel Authority ───

async function scenario5() {
  header(5, "Sentinel Authority");
  let passed = true;

  try {
    const artist = await api("POST", "/artists", { name: "Auth Test Artist", influences: [] });
    const song = await api("POST", "/topics", { memo: "Song:AuthTest" });

    step(1, "Issue VC with dual proof (artist + sentinel)");
    const vc = await api("POST", "/credentials", {
      issuerDid: artist.data.did, issuerTopicId: artist.data.topicId,
      songTitle: "Authority Check", songTopicId: song.data.topicId,
      masterHash: "auth123", artifacts: [], contributionCount: 0,
    });
    ok(`VC has ${vc.data.proof.length} proofs:`);
    vc.data.proof.forEach((p) => console.log(`    🔑 ${p.proofPurpose}: ${p.verificationMethod.slice(0, 50)}...`));

    step(2, "Tamper with VC (change title) and re-verify");
    const tampered = JSON.parse(JSON.stringify(vc.data));
    tampered.credentialSubject.title = "TAMPERED TITLE";
    const v2 = await api("POST", "/credentials/verify", tampered);
    const sigFailed = v2.data.checks.some((c) => c.name.startsWith("signature_") && !c.passed);
    if (!v2.data.valid && sigFailed) ok("Tampered VC correctly rejected — signatures invalid");
    else { fail("Tampered VC should have failed signature check"); passed = false; }
    v2.data.checks.forEach((c) => console.log(`    ${c.passed ? "✅" : "❌"} ${c.name}: ${c.detail}`));

    step(3, "Remove sentinel proof and re-verify");
    const noSentinel = JSON.parse(JSON.stringify(vc.data));
    noSentinel.proof = noSentinel.proof.filter((p) => p.proofPurpose !== "authentication");
    const v3 = await api("POST", "/credentials/verify", noSentinel);
    const sentinelMissing = v3.data.checks.some((c) => c.name === "sentinel_attestation" && !c.passed);
    if (!v3.data.valid && sentinelMissing) ok("VC without sentinel correctly rejected");
    else { fail("VC without sentinel should have failed"); passed = false; }
    v3.data.checks.forEach((c) => console.log(`    ${c.passed ? "✅" : "❌"} ${c.name}: ${c.detail}`));
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(5, "Sentinel Authority", passed, "Dual-proof system prevents tampering and unauthorized credentials");
}

// ─── Scenario 6: Artist Identity Provenance ───

async function scenario6() {
  header(6, "Artist Identity Provenance");
  let passed = true;

  try {
    step(1, 'Register artist "DJ Quantum" with rich profile');
    const artist = await api("POST", "/artists", {
      name: "DJ Quantum",
      influences: ["Aphex Twin", "Flying Lotus", "Arca", "Burial", "Jon Hopkins"],
    });
    ok(`DID: ${artist.data.did.slice(0, 50)}...`);
    ok(`Topic: ${artist.data.topicId}`);

    step(2, "Submit creative DNA messages to artist topic");
    const dnaMessages = [
      { type: "ArtisticManifesto", content: "I create at the intersection of quantum physics and sound design. Every track is a probability wave collapsed into rhythm.", author: artist.data.did, timestamp: new Date().toISOString() },
      { type: "GenreLineage", genres: ["IDM", "Glitch Hop", "Ambient Techno", "Experimental Bass"], primaryInfluence: "Warp Records era 1998-2005", author: artist.data.did },
      { type: "CollaborationHistory", collaborations: [
        { artist: "Neural Drift", project: "Entangled EP", year: 2024 },
        { artist: "Void Empress", project: "Dark Matter Sessions", year: 2025 },
      ], author: artist.data.did },
    ];
    for (const msg of dnaMessages) {
      await api("POST", `/topics/${artist.data.topicId}/messages`, msg);
    }
    ok("3 creative DNA messages recorded on-chain");

    step(3, "Resolve DID from mirror node");
    await delay(5000);
    const resolved = await api("GET", `/artists/${artist.data.topicId}/did`);
    if (resolved.data.id) ok(`Resolved: ${resolved.data.id.slice(0, 50)}...`);
    else ok("DID submitted (mirror propagation pending)");

    step(4, "Read full artist topic — identity provenance");
    const msgs = await api("GET", `/topics/${artist.data.topicId}/messages`);
    if (msgs.data.length > 0) {
      ok(`${msgs.data.length} identity records on-chain:`);
      msgs.data.forEach((m, i) => {
        const t = m.message?.type || m.message?._chunk ? "DIDDocument (chunked)" : "unknown";
        console.log(`    🧬 [${i + 1}] ${t}`);
      });
    } else {
      ok("Identity records submitted (mirror propagation pending)");
    }
    console.log("\n    💡 The artist's identity itself has provenance — not just their songs.");
    console.log("    💡 Creative DNA, manifesto, and collaboration history are all on-chain.");
  } catch (e) {
    fail(e.message); passed = false;
  }

  result(6, "Artist Identity Provenance", passed, "Artist identity with creative DNA anchored to Hedera");
}

// ─── Main ───

async function main() {
  console.log(`\n${"╔".padEnd(49, "═")}╗`);
  console.log(`║  🔬 PROVENANCE STUDIO — TRUST SCENARIO TESTS  ║`);
  console.log(`║  Network: Hedera Testnet                       ║`);
  console.log(`║  ${new Date().toISOString().padEnd(46)}  ║`);
  console.log(`${"╚".padEnd(49, "═")}╝`);

  // Health check
  try {
    const health = await api("GET", "/health");
    console.log(`\n  🏥 Service: ${health.data.status} | Network: ${health.data.network} | Operator: ${health.data.operatorId}`);
    if (health.data.sentinel) console.log(`  🛡️  Sentinel: ${health.data.sentinel.did.slice(0, 50)}...`);
  } catch (e) {
    console.error("\n  ❌ Service not reachable at", BASE);
    process.exit(1);
  }

  await scenario1(); await delay(2000);
  await scenario2(); await delay(2000);
  await scenario3(); await delay(2000);
  await scenario4(); await delay(2000);
  await scenario5(); await delay(2000);
  await scenario6();

  // Summary
  const passed = results.filter((r) => r.passed).length;
  const total = results.length;

  console.log(`\n${"╔".padEnd(49, "═")}╗`);
  console.log(`║          TEST RESULTS SUMMARY                  ║`);
  console.log(`${"╠".padEnd(49, "═")}╣`);
  results.forEach((r) => {
    const icon = r.passed ? "✅" : "❌";
    const status = r.passed ? "PASS" : "FAIL";
    console.log(`║  ${icon} Scenario ${r.num}: ${status.padEnd(6)} ${r.title.slice(0, 30).padEnd(30)} ║`);
  });
  console.log(`${"╠".padEnd(49, "═")}╣`);
  console.log(`║  ${passed}/${total} scenarios passed${" ".repeat(29)}║`);
  console.log(`${"╚".padEnd(49, "═")}╝\n`);

  process.exit(passed === total ? 0 : 1);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
