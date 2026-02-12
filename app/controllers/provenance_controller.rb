class ProvenanceController < ApplicationController
  before_action :set_song

  def show
    @contributions = @song.contributions.order(position: :asc)
    @tracks = @song.tracks.order(version: :desc)
    @provenance_records = @song.provenance_records.order(generated_at: :desc)
  end

  def generate
    # TODO: Generate actual provenance document (PDF/JSON)
    record = @song.provenance_records.create!(
      format: params[:format] || "json",
      generated_at: Time.current,
      notes: "Auto-generated provenance record"
    )
    redirect_to song_provenance_path(@song), notice: "Provenance record generated."
  end

  def download
    record = @song.provenance_records.find(params[:id])
    # TODO: Serve actual file once generation is implemented
    render json: {
      song: @song.as_json,
      contributions: @song.contributions.order(position: :asc).as_json,
      tracks: @song.tracks.order(version: :desc).as_json,
      generated_at: record.generated_at
    }
  end

  private

  def set_song
    @song = Song.find(params[:song_id])
  end
end
