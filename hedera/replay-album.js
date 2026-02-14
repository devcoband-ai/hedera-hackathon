#!/usr/bin/env node
// replay-album.js — Replay "Let's Stay This Way" by Devco onto Hedera testnet
// A narrated, entertaining provenance demo

const BASE = 'http://localhost:3335';
const DELAY = 3000; // ms between major operations

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function api(method, path, body, retries = 3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const opts = { method, headers: { 'Content-Type': 'application/json' } };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(`${BASE}${path}`, opts);
      if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${await res.text()}`);
      return res.json();
    } catch (err) {
      if (attempt === retries) throw err;
      console.log(`   ⏳ Retry ${attempt}/${retries} after error: ${err.message}`);
      await sleep(3000 * attempt);
    }
  }
}

const post = (path, body) => api('POST', path, body);
const get = (path) => api('GET', path);

let output = [];
function log(msg = '') { console.log(msg); output.push(msg); }

let totalContributions = 0;
let totalVCs = 0;

async function submitContribution(topicId, contribution) {
  const result = await post(`/topics/${topicId}/messages`, contribution);
  totalContributions++;
  return result;
}

async function main() {
  log('');
  log('═══════════════════════════════════════════════════════════════');
  log('  🎸 LET\'S STAY THIS WAY — DEVCO — LOCAL RECORDS — 2026');
  log('  Replaying an entire album\'s creative history onto Hedera');
  log('═══════════════════════════════════════════════════════════════');
  log('');

  // ── Health check ──
  const health = await get('/health');
  log(`🔗 Connected to Hedera ${health.network} | Operator: ${health.operatorId}`);
  log(`🛡️  Sentinel DID: ${health.sentinel?.did?.slice(0,50)}...`);
  log('');

  // ═══════════════════════════════════════
  // PHASE 1: REGISTER ARTISTS
  // ═══════════════════════════════════════
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('  PHASE 1: ARTIST REGISTRATION');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('');

  const artists = {};

  const artistDefs = [
    { name: 'Jeff Highman', influences: ['My Bloody Valentine', 'Radiohead', 'Shoegaze'], desc: 'Songwriter, lyricist, creative director' },
    { name: 'Sam Carter', influences: ['Sade', 'Trip-hop', 'Analog warmth'], desc: 'Producer' },
    { name: 'Jon Bon Buckle', influences: ['Ariel Pink', 'Art Chantry', 'Warhol', 'Brutalism'], desc: 'Label president (Local Records), The Dark Navy' },
    { name: 'Devco AI', influences: ['Suno', 'Grok', 'GPT', 'Neural networks'], desc: 'AI collaborator — the machine gets an identity' },
  ];

  for (const a of artistDefs) {
    const result = await post('/artists', { name: a.name, influences: a.influences });
    artists[a.name] = result;
    log(`🎤 ${a.name} — ${a.desc}`);
    log(`   DID: ${result.did.slice(0,60)}...`);
    log(`   Topic: ${result.topicId}`);
    log('');
    await sleep(5000);
  }

  // ═══════════════════════════════════════
  // PHASE 2: CREATE ALBUM TOPIC
  // ═══════════════════════════════════════
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('  PHASE 2: ALBUM TOPIC');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('');

  const album = await post('/topics', { memo: "Let's Stay This Way — Devco — Local Records — 2026" });
  log(`📀 Album topic created: ${album.topicId}`);
  log(`   https://hashscan.io/testnet/topic/${album.topicId}`);
  log('');
  await sleep(DELAY);

  // ═══════════════════════════════════════
  // PHASE 3: COVER ART PROVENANCE
  // ═══════════════════════════════════════
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('  PHASE 3: COVER ART PROVENANCE');
  log('  10 decisions. 4 collaborators. 1 unauthorized post.');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('');

  const coverArtNodes = [
    { by: 'Jeff Highman', action: 'prompt', detail: 'Jeff prompts AI: "What is the most unexpected art style for an album cover?"' },
    { by: 'Devco AI', action: 'response', detail: 'AI returns: "Neo-Mosaic Glitchlum" — a style nobody asked for, nobody expected' },
    { by: 'Jeff Highman', action: 'prompt', detail: 'Jeff prompts for image generation in Neo-Mosaic Glitchlum style' },
    { by: 'Devco AI', action: 'generation', detail: 'AI generates: Czech girl with chain gun, glitched trailer park sunset. Uh...' },
    { by: 'Jeff Highman', action: 'creative_decision', detail: 'Jeff decides to REMOVE the girl — the setting is the story, not the character' },
    { by: 'Jeff Highman', action: 'approval', detail: 'Final image: glitched trailer park sunset, brilliant orange. This is the one.' },
    { by: 'Jon Bon Buckle', action: 'design', detail: 'Jon adds band name "DEVCO" in brutalist typography' },
    { by: 'Jon Bon Buckle', action: 'design', detail: 'Jon adds album title "Let\'s Stay This Way" treatment' },
    { by: 'Jon Bon Buckle', action: 'approval', detail: 'Jon approves final cover art layout' },
    { by: 'Sam Carter', action: '⚠️ UNAUTHORIZED', detail: '🚨 Sam posts cover to X without authorization. It\'s beautiful, but it\'s leaked. Logged forever.' },
  ];

  for (const node of coverArtNodes) {
    await submitContribution(album.topicId, {
      type: 'cover_art_contribution',
      contributor: node.by,
      contributorDid: artists[node.by]?.did,
      action: node.action,
      detail: node.detail,
      timestamp: new Date().toISOString(),
    });
    log(`   🎨 ${node.detail}`);
    await sleep(500);
  }
  log('');
  log(`   ✅ Cover art: ${coverArtNodes.length} contributions on-chain`);
  log('');
  await sleep(DELAY);

  // ═══════════════════════════════════════
  // PHASE 4: TRACKS
  // ═══════════════════════════════════════
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('  PHASE 4: THE 12 TRACKS');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('');

  const tracks = [
    {
      num: 1, title: 'Screwed',
      story: 'Sam heard the first demo and said: "If this is the best you can do, we\'re screwed." It stuck.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Prompts Suno: "synth wave dark 80s" — rejected immediately' },
        { by: 'Sam Carter', detail: '"If this is the best you can do, we\'re screwed" — meant as critique, became the hook' },
        { by: 'Jeff Highman', detail: 'Deploys 147-word Devco sound template (shoegaze remix)' },
        { by: 'Devco AI', detail: 'Generates: "Sha la sha la, if this is the best you can do, we\'re screwed"' },
        { by: 'Jon Bon Buckle', detail: '🍑 Jon\'s butt accidentally referenced in Suno prompt. IMMUTABLE. ON-CHAIN FOREVER.' },
        { by: 'Jeff Highman', detail: '"This is my favorite part when it starts" — spoken comment captured as lyric by Suno' },
        { by: 'Jon Bon Buckle', detail: 'Decides: Track 1 position. Streaming algorithms favor strong openers. Strategy.' },
      ]
    },
    {
      num: 2, title: 'Sounds Like Heaven',
      story: 'Jeff stares at the cover art and writes: "Brilliant orange tarnished by the sea." These lyrics will appear three times.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Writes lyrics inspired by album cover: "Brilliant orange tarnished by the sea"' },
        { by: 'Devco AI', detail: 'Devco grunge template applied at 88 BPM' },
        { by: 'Jeff Highman', detail: 'Notes: same lyrics will appear on Track 5 and Track 12 — intentional repetition' },
      ]
    },
    {
      num: 3, title: 'Ciudad',
      story: 'Started as a test of the provenance system itself. Became the most collaborative track on the album.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Initiates Ciudad as a simulation/dry run of the provenance system' },
        { by: 'Devco AI', detail: 'AI generates lyrics about leaving Miami: "I left the lights on"' },
        { by: 'Sam Carter', detail: 'Pulls the bridge entirely — it was slowing the song down' },
        { by: 'Sam Carter', detail: 'Reorders verse 3 — the narrative needed restructuring' },
        { by: 'Sam Carter', detail: 'Refines lyric: "I just say goodnight" → "I just kill the lights" — harder, better' },
        { by: 'Jon Bon Buckle', detail: '⚠️ Objects to AI-authored track. "Machines don\'t make art." OVERRULED.' },
        { by: 'Jon Bon Buckle', detail: 'Despite objection, placed in high-visibility slot 3. The people have spoken.' },
      ]
    },
    {
      num: 4, title: 'Unannounced',
      story: 'Jeff types "Unnnouced" — a typo. The AI stumbles on pronunciation. It sounds like a drunk poet. Sam says: "Keep it."',
      contributions: [
        { by: 'Jeff Highman', detail: 'Types title as "Unnnouced" — typo preserved, immutable' },
        { by: 'Devco AI', detail: 'AI stumbles on pronunciation — sounds like a drunk poet reading at 2am' },
        { by: 'Sam Carter', detail: '"Keep it." — the imperfection IS the art' },
        { by: 'Devco AI', detail: 'Suno extends: "Does it feel right to my face", "Your neck on the line"' },
        { by: 'Jeff Highman', detail: 'Accepts AI lyric extensions — logged as human decision to keep machine output' },
      ]
    },
    {
      num: 5, title: 'Album Cover Painting',
      story: 'Same lyrics as Track 2, now acoustic at 76 BPM. Jeff cites Seal: two versions of the same lyrics on one album. Jon objects. Overruled.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Same lyrics as Track 2, reimagined as acoustic treatment at 76 BPM' },
        { by: 'Jeff Highman', detail: 'Cites Seal precedent: two versions of same lyrics on one album (Category A)' },
        { by: 'Jon Bon Buckle', detail: 'Objects to duplicate lyrics on same album. Overruled with Category A precedent.' },
        { by: 'Devco AI', detail: 'Acoustic arrangement generated from Devco template' },
      ]
    },
    {
      num: 6, title: 'Already True',
      story: '100% human. Jeff fed 75 pages/month of journals into AI. The AIs converged on one truth: "You were already what you were trying to become." Then Jeff wrote every word himself.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Feeds 75 pages/month of journals (100K+ thoughts) into Grok and GPT' },
        { by: 'Devco AI', detail: 'AIs converge: "You were already what you were trying to become" — inspiration only' },
        { by: 'Jeff Highman', detail: 'Writes ALL lyrics himself — no AI generation. 100% human authorship.' },
        { by: 'Sam Carter', detail: '"Don\'t touch the production." — Sam knows when to step back' },
        { by: 'Jon Bon Buckle', detail: '"Don\'t touch anything." — unanimous: this one is sacred' },
      ]
    },
    {
      num: 7, title: 'Pop Song Summer',
      story: 'Derived from Jeff\'s published book (Kindle, copyrighted). The child\'s prompt became the parent\'s identity.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Source: Jeff\'s published book (Kindle, copyrighted). "Take second lover, the over and under"' },
        { by: 'Jeff Highman', detail: 'Derivative "Second Love" prompt became the Devco sound template' },
        { by: 'Devco AI', detail: 'The child\'s prompt became the parent\'s identity — recursive provenance' },
        { by: 'Jeff Highman', detail: 'Paradox logged: the derivative defined the original\'s sonic identity' },
      ]
    },
    {
      num: 8, title: 'Intimate Restraint',
      story: 'Same lyrics. Different genre. Different meaning entirely. Sam hears Sade. Jeff says no. Jon says dream pop. Jeff says no. The artist decides.',
      contributions: [
        { by: 'Sam Carter', detail: 'V1: sultry, minimal. Sam says "sounds like Sade" — Category B, not chained to V2' },
        { by: 'Jeff Highman', detail: 'Rejects Sam\'s suggestion (trip-hop) — creative control exercised' },
        { by: 'Jon Bon Buckle', detail: 'Suggests dream pop. Also rejected. Jeff\'s vision prevails.' },
        { by: 'Devco AI', detail: 'V2: ambient psytrance tribal ethereal — the version that stuck' },
        { by: 'Jeff Highman', detail: 'Same lyrics, different genre = different meaning. Logged as creative principle.' },
      ]
    },
    {
      num: 9, title: "Let's Stay This Way",
      story: 'The title track. Written January 4, 2026 — before the album concept even existed. Placed at track 9 like a heart.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Written January 4, 2026 — before the album concept existed' },
        { by: 'Jeff Highman', detail: '"It sounds like heaven when you lie, but I see it when you roll your eyes"' },
        { by: 'Jon Bon Buckle', detail: 'Sequencing decision: Track 9. Center of gravity. The heart of the album.' },
        { by: 'Devco AI', detail: 'Production template applied — the sound of longing' },
      ]
    },
    {
      num: 10, title: 'Flowin',
      story: 'A meta song about trying to write songs. V1 was atmospheric grungecore (rejected). V2 happened because the prompt got truncated. Happy accident.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Meta song about trying to write songs — the process as the product' },
        { by: 'Devco AI', detail: 'V1: atmospheric grungecore — rejected' },
        { by: 'Devco AI', detail: 'V2: acoustic guitars, pulsing bass, lo-fi layers — kept due to TRUNCATED PROMPT' },
        { by: 'Jeff Highman', detail: '"When it\'s flowing you\'re not alone" × 3 — the mantra' },
      ]
    },
    {
      num: 11, title: 'Christmas Time',
      story: 'Written Christmas Day. Six words: "acoustic folk harmony laced gratitude." Sometimes that\'s enough.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Written Christmas Day, 6-word prompt: "acoustic folk harmony laced gratitude"' },
        { by: 'Devco AI', detail: 'Initial generation from the 6-word prompt' },
        { by: 'Jeff Highman', detail: 'Remixed with "shoegaze dream pop 1999" — nostalgia filter' },
        { by: 'Jeff Highman', detail: 'Acoustic version kept as B-side — the original spirit preserved' },
      ]
    },
    {
      num: 12, title: 'Sounds Like Heaven Revisited',
      story: 'Same lyrics as tracks 2 and 5. Third appearance. Acoustic, quiet, stripped back. Full circle.',
      contributions: [
        { by: 'Jeff Highman', detail: 'Same lyrics as Track 2 and Track 5 — third and final appearance' },
        { by: 'Jeff Highman', detail: 'Acoustic, quiet, stripped back — the lyrics finally naked' },
        { by: 'Jon Bon Buckle', detail: 'Sequencing: Track 12. Full circle. The album ends where it began.' },
      ]
    },
  ];

  const trackTopics = {};

  for (const track of tracks) {
    const topic = await post('/topics', { memo: `Track ${track.num}: ${track.title} — Devco` });
    trackTopics[track.num] = topic.topicId;

    log(`🎵 Track ${track.num}: ${track.title}`);
    log(`   ${track.story}`);

    // Link track to album
    await submitContribution(album.topicId, {
      type: 'track_registration',
      trackNumber: track.num,
      title: track.title,
      trackTopicId: topic.topicId,
      timestamp: new Date().toISOString(),
    });

    for (const c of track.contributions) {
      await submitContribution(topic.topicId, {
        type: 'contribution',
        contributor: c.by,
        contributorDid: artists[c.by]?.did,
        detail: c.detail,
        trackNumber: track.num,
        trackTitle: track.title,
        timestamp: new Date().toISOString(),
      });
      log(`   📝 ${c.detail}`);
      await sleep(1000);
    }

    log(`   ✅ Topic: ${topic.topicId} | ${track.contributions.length} contributions on-chain`);
    log('');
    await sleep(DELAY);
  }

  // ═══════════════════════════════════════
  // PHASE 5: VERIFIABLE CREDENTIALS
  // ═══════════════════════════════════════
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('  PHASE 5: VERIFIABLE CREDENTIALS');
  log('  Who made what. How much. Immutable.');
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  log('');

  const vcDefs = [
    {
      title: "Let's Stay This Way (Album)",
      topicId: album.topicId,
      issuer: 'Jeff Highman',
      creators: [
        { did: artists['Jeff Highman'].did, role: 'creative director / songwriter', share: 50 },
        { did: artists['Sam Carter'].did, role: 'producer', share: 25 },
        { did: artists['Jon Bon Buckle'].did, role: 'label / curation', share: 25 },
      ],
      desc: 'Album-level VC: Jeff 50%, Sam 25%, Jon 25%',
    },
    {
      title: 'Ciudad',
      topicId: trackTopics[3],
      issuer: 'Jeff Highman',
      creators: [
        { did: artists['Jeff Highman'].did, role: 'songwriter', share: 30 },
        { did: artists['Sam Carter'].did, role: 'producer (heavy edits)', share: 40 },
        { did: artists['Devco AI'].did, role: 'AI collaborator', share: 30 },
      ],
      desc: 'Ciudad VC: Jeff 30%, Sam 40% (heavy production), AI 30%',
    },
    {
      title: 'Already True',
      topicId: trackTopics[6],
      issuer: 'Jeff Highman',
      creators: [
        { did: artists['Jeff Highman'].did, role: 'songwriter (100% human)', share: 100 },
      ],
      desc: 'Already True VC: Jeff 100% — all human, no AI generation',
    },
    {
      title: 'Cover Art — Let\'s Stay This Way',
      topicId: album.topicId,
      issuer: 'Jeff Highman',
      creators: [
        { did: artists['Jeff Highman'].did, role: 'art direction', share: 40 },
        { did: artists['Jon Bon Buckle'].did, role: 'design / typography', share: 30 },
        { did: artists['Sam Carter'].did, role: 'unauthorized posting to X', share: 15 },
        { did: artists['Devco AI'].did, role: 'AI image generation', share: 15 },
      ],
      desc: 'Cover Art VC: Jeff 40%, Jon 30%, Sam 15% (unauthorized!), AI 15%',
    },
  ];

  for (const vc of vcDefs) {
    const result = await post('/credentials', {
      issuerDid: artists[vc.issuer].did,
      issuerTopicId: artists[vc.issuer].topicId,
      songTitle: vc.title,
      songTopicId: vc.topicId,
      contributionCount: totalContributions,
      creators: vc.creators,
    });
    totalVCs++;
    log(`   🏆 ${vc.desc}`);
    log(`      VC ID: ${result.id}`);
    log(`      Proofs: ${result.proof.length} (issuer + sentinel co-signature)`);
    log('');
    await sleep(DELAY);
  }

  // ═══════════════════════════════════════
  // FINALE
  // ═══════════════════════════════════════
  log('');
  log('═══════════════════════════════════════════════════════════════');
  log(`📀 ALBUM: "Let's Stay This Way" by Devco`);
  log(`   12 tracks | ${totalContributions} total contributions | ${totalVCs} VCs issued`);
  log(`   Album topic: ${album.topicId}`);
  log(`   https://hashscan.io/testnet/topic/${album.topicId}`);
  log('');
  log('   All on Hedera testnet. All immutable. All provable.');
  log('   Jon\'s butt is in the blockchain forever.');
  log('═══════════════════════════════════════════════════════════════');
  log('');

  // Save output
  const fs = await import('fs');
  fs.writeFileSync(new URL('./album-replay-results.txt', import.meta.url), output.join('\n'));
  console.log('📄 Results saved to album-replay-results.txt');
}

main().catch(err => {
  console.error('💥 Fatal error:', err);
  process.exit(1);
});
