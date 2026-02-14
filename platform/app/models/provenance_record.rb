# A ProvenanceRecord is a generated document (PDF or JSON) that captures
# the full provenance chain for a Song at a point in time.
class ProvenanceRecord < ApplicationRecord
  belongs_to :song

  validates :format, presence: true, inclusion: { in: %w[pdf json] }

  FORMATS = %w[pdf json].freeze
end
