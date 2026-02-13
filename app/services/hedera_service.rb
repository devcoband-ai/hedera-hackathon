require "net/http"
require "json"

# Calls the Node.js Hedera HCS microservice (port 3335)
# See hedera/README.md for setup instructions
class HederaService
  BASE_URL = ENV.fetch("HEDERA_SERVICE_URL", "http://localhost:3335")

  def self.create_topic(memo = "")
    uri = URI("#{BASE_URL}/topics")
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = { memo: memo }.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
    JSON.parse(res.body)
  end

  def self.submit_message(topic_id, message)
    uri = URI("#{BASE_URL}/topics/#{topic_id}/messages")
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = message.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
    JSON.parse(res.body)
  end

  def self.get_messages(topic_id)
    uri = URI("#{BASE_URL}/topics/#{topic_id}/messages")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  end
end
