# A Track is a version or stem of a Song (e.g., "v1 demo", "v2 with vocals").
class Track < ApplicationRecord
  belongs_to :song

  validates :title, presence: true
end
