class TopicExplorerController < ApplicationController
  def show
    @topic_id = params[:topic_id]
    @messages = HederaService.get_topic_messages(@topic_id)
    @topic_info = HederaService.get_topic_info(@topic_id)

    # Reassemble chunked messages
    @decoded = []
    chunk_buffer = []

    Array(@messages).each do |m|
      msg = m["message"] || m
      if msg.is_a?(Hash) && msg["_chunk"]
        chunk_buffer << msg
        if msg["index"] == msg["total"] - 1
          chunk_buffer.sort_by! { |c| c["index"] }
          full = JSON.parse(chunk_buffer.map { |c| c["data"] }.join)
          @decoded << { seq: m["sequenceNumber"], ts: m["timestamp"], msg: full }
          chunk_buffer = []
        end
      else
        @decoded << { seq: m["sequenceNumber"], ts: m["timestamp"], msg: msg }
      end
    end
  end
end
