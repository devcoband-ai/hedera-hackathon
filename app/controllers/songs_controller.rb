class SongsController < ApplicationController
  before_action :set_song, only: [:show, :edit, :update, :destroy]

  def index
    @songs_by_status = Song.includes(:tracks, :contributions).order(updated_at: :desc).group_by(&:status)
  end

  def show
    @tracks = @song.tracks.order(version: :desc)
    @contributions = @song.contributions.order(position: :asc)
    @provenance_records = @song.provenance_records.order(generated_at: :desc)
  end

  def new
    @song = Song.new
  end

  def create
    @song = Song.new(song_params)
    if @song.save
      redirect_to song_path(@song), notice: "Song created."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @song.update(song_params)
      redirect_to song_path(@song), notice: "Song updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @song.destroy
    redirect_to songs_path, notice: "Song deleted."
  end

  private

  def set_song
    @song = Song.find(params[:id])
  end

  def song_params
    params.require(:song).permit(:title, :description, :genre, :status, :album)
  end
end
