# A Song represents a musical work being tracked through the creative process.
# Each song can have multiple tracks (versions/stems), contributions (who did what),
# and provenance records (generated documentation).
class Song < ApplicationRecord
  has_many :tracks, dependent: :destroy
  has_many :contributions, dependent: :destroy
  has_many :provenance_records, dependent: :destroy

  validates :title, presence: true
  validates :status, inclusion: { in: %w[idea drafting iterating review final submitted] }

  # Valid status values for the song lifecycle
  STATUSES = %w[idea drafting iterating review final submitted].freeze
end
