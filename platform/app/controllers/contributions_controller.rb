class ContributionsController < ApplicationController
  before_action :set_song
  before_action :set_contribution, only: [:edit, :update, :destroy]

  def new
    @contribution = @song.contributions.build
  end

  def create
    @contribution = @song.contributions.build(contribution_params)
    if @contribution.save
      # Record contribution on Hedera if song has a topic
      if @song.hedera_topic_id.present?
        begin
          result = HederaService.submit_message(@song.hedera_topic_id, {
            role: @contribution.role,
            actor_type: @contribution.actor_type,
            actor_name: @contribution.actor_name,
            description: @contribution.description
          })
          @contribution.update(
            hedera_sequence_number: result["sequenceNumber"],
            hedera_timestamp: result["timestamp"]
          )
        rescue => e
          Rails.logger.warn("Hedera message submission failed: #{e.message}")
        end
      end
      redirect_to song_path(@song), notice: "Contribution added."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit; end

  def update
    if @contribution.update(contribution_params)
      redirect_to song_path(@song), notice: "Contribution updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @contribution.destroy
    redirect_to song_path(@song), notice: "Contribution removed."
  end

  private

  def set_song
    @song = Song.find(params[:song_id])
  end

  def set_contribution
    @contribution = @song.contributions.find(params[:id])
  end

  def contribution_params
    params.require(:contribution).permit(:role, :actor_type, :actor_name, :description, :evidence, :position, :parent_contribution_id)
  end
end
