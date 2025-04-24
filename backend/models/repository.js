const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RepositorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  full_name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  html_url: {
    type: String,
    required: true,
  },
  stars: {
    type: Number,
    default: 0,
  },
  forks: {
    type: Number,
    default: 0,
  },
  open_issues: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imported_at: {
    type: Date,
    default: Date.now,
  },
  last_synced: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Repository", RepositorySchema);
