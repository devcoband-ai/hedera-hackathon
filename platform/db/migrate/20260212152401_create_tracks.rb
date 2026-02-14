class CreateTracks < ActiveRecord::Migration[8.0]
  def change
    create_table :tracks do |t|
      t.references :song, null: false, foreign_key: true
      t.string :title, null: false
      t.integer :version, default: 1
      t.text :notes
      t.string :file_path

      t.timestamps
    end
  end
end
