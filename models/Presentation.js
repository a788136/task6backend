const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const presentationSchema = new Schema({
  title: { type: String, required: true },
  creatorNickname: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  users: [{
    nickname: String,
    role: { type: String, enum: ['editor', 'viewer'] }
  }]
});



module.exports = mongoose.model('Presentation', presentationSchema);
