const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotesSchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
    default: "",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    default: "",
  },
});

const Notes = mongoose.model("Notes", NotesSchema);

module.exports = Notes;
