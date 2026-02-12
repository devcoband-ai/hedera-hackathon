# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_02_12_152406) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "contributions", force: :cascade do |t|
    t.bigint "song_id", null: false
    t.string "role", null: false
    t.string "actor_type", null: false
    t.string "actor_name", null: false
    t.text "description"
    t.text "evidence"
    t.integer "position", default: 0
    t.integer "parent_contribution_id"
    t.integer "hedera_sequence_number"
    t.datetime "hedera_timestamp"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["song_id"], name: "index_contributions_on_song_id"
  end

  create_table "provenance_records", force: :cascade do |t|
    t.bigint "song_id", null: false
    t.string "format"
    t.string "file_path"
    t.datetime "generated_at"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["song_id"], name: "index_provenance_records_on_song_id"
  end

  create_table "songs", force: :cascade do |t|
    t.string "title", null: false
    t.text "description"
    t.string "genre"
    t.string "album"
    t.string "status", default: "idea"
    t.string "hedera_topic_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tracks", force: :cascade do |t|
    t.bigint "song_id", null: false
    t.string "title", null: false
    t.integer "version", default: 1
    t.text "notes"
    t.string "file_path"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["song_id"], name: "index_tracks_on_song_id"
  end

  add_foreign_key "contributions", "songs"
  add_foreign_key "provenance_records", "songs"
  add_foreign_key "tracks", "songs"
end
