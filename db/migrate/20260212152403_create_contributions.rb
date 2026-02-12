class CreateContributions < ActiveRecord::Migration[8.0]
  def change
    create_table :contributions do |t|
      t.references :song, null: false, foreign_key: true
      t.string :role, null: false
      t.string :actor_type, null: false
      t.string :actor_name, null: false
      t.text :description
      t.text :evidence
      t.integer :position, default: 0
      t.integer :parent_contribution_id
      t.integer :hedera_sequence_number
      t.datetime :hedera_timestamp

      t.timestamps
    end
  end
end
