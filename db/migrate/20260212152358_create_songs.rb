class CreateSongs < ActiveRecord::Migration[8.0]
  def change
    create_table :songs do |t|
      t.string :title, null: false
      t.text :description
      t.string :genre
      t.string :album
      t.string :status, default: "idea"
      t.string :hedera_topic_id

      t.timestamps
    end
  end
end
