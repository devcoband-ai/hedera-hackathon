# A Contribution records who (or what) contributed to a Song and how.
# This is the core of music provenance — tracking human, AI, and hybrid contributions.
class Contribution < ApplicationRecord
  belongs_to :song
  belongs_to :parent_contribution, class_name: "Contribution", optional: true
  has_many :child_contributions, class_name: "Contribution", foreign_key: :parent_contribution_id

  validates :role, presence: true, inclusion: { in: %w[lyricist producer prompt_engineer creative_director mixer reviewer ai_engine] }
  validates :actor_type, presence: true, inclusion: { in: %w[human ai hybrid] }
  validates :actor_name, presence: true

  # Valid roles for contributions
  ROLES = %w[lyricist producer prompt_engineer creative_director mixer reviewer ai_engine].freeze

  # Valid actor types
  ACTOR_TYPES = %w[human ai hybrid].freeze
end
