class TracksController < ApplicationController
  before_action :set_song
  before_action :set_track, only: [:edit, :update, :destroy]

  def new
    @track = @song.tracks.build
  end

  def create
    @track = @song.tracks.build(track_params)
    if @track.save
      redirect_to song_path(@song), notice: "Track added."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @track.update(track_params)
      redirect_to song_path(@song), notice: "Track updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @track.destroy
    redirect_to song_path(@song), notice: "Track removed."
  end

  private

  def set_song
    @song = Song.find(params[:song_id])
  end

  def set_track
    @track = @song.tracks.find(params[:id])
  end

  def track_params
    params.require(:track).permit(:title, :version, :notes, :file_path)
  end
end
