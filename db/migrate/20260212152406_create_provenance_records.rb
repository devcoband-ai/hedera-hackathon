class CreateProvenanceRecords < ActiveRecord::Migration[8.0]
  def change
    create_table :provenance_records do |t|
      t.references :song, null: false, foreign_key: true
      t.string :format
      t.string :file_path
      t.datetime :generated_at
      t.text :notes

      t.timestamps
    end
  end
end
