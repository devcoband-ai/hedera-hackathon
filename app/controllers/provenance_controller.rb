class ProvenanceController < ApplicationController
  before_action :set_song

  def show
    @contributions = @song.contributions.order(position: :asc)
    @tracks = @song.tracks.order(version: :desc)
    @provenance_records = @song.provenance_records.order(generated_at: :desc)
  end

  def generate
    record = @song.provenance_records.create!(
      format: params[:format] || "json",
      generated_at: Time.current,
      notes: "Auto-generated provenance record"
    )
    redirect_to song_provenance_path(@song), notice: "Provenance record generated."
  end

  def download
    record = @song.provenance_records.find(params[:id])
    render json: {
      song: @song.as_json,
      contributions: @song.contributions.order(position: :asc).as_json,
      tracks: @song.tracks.order(version: :desc).as_json,
      generated_at: record.generated_at
    }
  end

  def package
    service = ProvenancePackageService.new(@song)
    @package = service.generate

    respond_to do |format|
      format.json do
        send_data JSON.pretty_generate(@package),
          filename: "#{@song.title.parameterize}-provenance-package.json",
          type: "application/json",
          disposition: "attachment"
      end
      format.html { redirect_to song_provenance_package_path(@song, format: :json) }
    end
  end

  def certificate
    service = ProvenancePackageService.new(@song)
    @package = service.generate
    @master_hash = @package[:master_hash_sha256]
    @manifest = @package[:manifest]
    render layout: false
  end

  private

  def set_song
    @song = Song.find(params[:song_id])
  end
end
