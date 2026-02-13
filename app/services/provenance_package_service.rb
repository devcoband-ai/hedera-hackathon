require "digest"

class ProvenancePackageService
  def initialize(song, artist_did: nil, artist_topic_id: nil, creators: nil)
    @song = song
    @artist_did = artist_did
    @artist_topic_id = artist_topic_id
    @creators = creators # Array of { did:, role:, share: } or nil
  end

  def generate
    artifacts = []

    @song.tracks.each do |track|
      if track.file_path.present?
        full_path = Rails.root.join("storage", track.file_path.sub(/^\//, ""))
        if File.exist?(full_path)
          artifacts << {
            type: "audio",
            name: track.title,
            version: track.version,
            sha256: Digest::SHA256.hexdigest(File.read(full_path)),
            size_bytes: File.size(full_path),
            file_path: track.file_path
          }
        end
      end
    end

    chain = @song.contributions.order(position: :asc).map do |c|
      {
        sequence: c.hedera_sequence_number,
        timestamp: c.hedera_timestamp,
        role: c.role,
        actor_type: c.actor_type,
        actor_name: c.actor_name,
        description: c.description,
        evidence: c.evidence
      }
    end

    on_chain_messages = []
    if @song.hedera_topic_id.present?
      begin
        on_chain_messages = HederaService.get_messages(@song.hedera_topic_id)
      rescue => e
        Rails.logger.warn "Hedera fetch failed: #{e.message}"
      end
    end

    manifest = {
      version: "1.0",
      generated_at: Time.current.iso8601,
      song: {
        title: @song.title,
        description: @song.description,
        genre: @song.genre,
        album: @song.album,
        status: @song.status,
        created_at: @song.created_at.iso8601
      },
      hedera: {
        network: "testnet",
        topic_id: @song.hedera_topic_id,
        hashscan_url: @song.hedera_topic_id ? "https://hashscan.io/testnet/topic/#{@song.hedera_topic_id}" : nil,
        message_count: on_chain_messages.length
      },
      artifacts: artifacts,
      provenance_chain: chain,
      on_chain_verification: on_chain_messages,
      artifact_hashes: artifacts.map { |a| { name: a[:name], sha256: a[:sha256] } }
    }

    manifest_json = JSON.pretty_generate(manifest)
    master_hash = Digest::SHA256.hexdigest(manifest_json)

    package = {
      master_hash_sha256: master_hash,
      manifest: manifest
    }

    if @song.hedera_topic_id.present?
      begin
        HederaService.submit_message(@song.hedera_topic_id, {
          type: "provenance_certificate",
          master_hash_sha256: master_hash,
          artifact_count: artifacts.length,
          contribution_count: chain.length,
          generated_at: Time.current.iso8601
        })
      rescue => e
        Rails.logger.warn "Hedera stamp failed: #{e.message}"
      end

      # Issue a Verifiable Credential if artist DID info is available
      if @artist_did.present? && @artist_topic_id.present?
        begin
          vc_params = {
            issuerDid: @artist_did,
            issuerTopicId: @artist_topic_id,
            songTitle: @song.title,
            songTopicId: @song.hedera_topic_id,
            masterHash: master_hash,
            artifacts: artifacts.map { |a| { type: "audio", name: a[:name], sha256: a[:sha256] } },
            contributionCount: chain.length
          }

          # Include creators for multi-party collaborative VCs
          if @creators.present?
            vc_params[:creators] = @creators
          end

          vc = HederaService.issue_credential(vc_params)
          package[:verifiable_credential] = vc
        rescue => e
          Rails.logger.warn "VC issuance failed: #{e.message}"
        end
      end
    end

    # Resolve sentinel info for display
    begin
      package[:sentinel] = HederaService.resolve_sentinel
    rescue => e
      Rails.logger.warn "Sentinel resolution failed: #{e.message}"
    end

    package
  end
end
