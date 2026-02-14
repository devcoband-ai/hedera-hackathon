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

  def self.register_artist(name, influences = [])
    uri = URI("#{BASE_URL}/artists")
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = { name: name, influences: influences }.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
    JSON.parse(res.body)
  end

  def self.issue_credential(params)
    uri = URI("#{BASE_URL}/credentials")
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = params.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
    JSON.parse(res.body)
  end

  def self.resolve_did(topic_id)
    uri = URI("#{BASE_URL}/artists/#{topic_id}/did")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  end

  def self.resolve_sentinel
    uri = URI("#{BASE_URL}/sentinel")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  end

  def self.verify_credential(vc_json)
    uri = URI("#{BASE_URL}/credentials/verify")
    req = Net::HTTP::Post.new(uri, "Content-Type" => "application/json")
    req.body = vc_json.is_a?(String) ? vc_json : vc_json.to_json
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(req) }
    JSON.parse(res.body)
  end

  def self.get_topic_info(topic_id)
    uri = URI("#{BASE_URL}/topics/#{topic_id}/info")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  rescue StandardError => e
    { "error" => e.message }
  end

  def self.get_topic_messages(topic_id)
    uri = URI("#{BASE_URL}/topics/#{topic_id}/messages")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  rescue StandardError => e
    []
  end

  def self.get_messages(topic_id)
    uri = URI("#{BASE_URL}/topics/#{topic_id}/messages")
    res = Net::HTTP.start(uri.hostname, uri.port) { |http| http.request(Net::HTTP::Get.new(uri)) }
    JSON.parse(res.body)
  end
end
