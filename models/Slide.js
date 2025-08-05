const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  _id: { type: Schema.Types.Mixed, auto: true }, // <-- Позволяет строковые id на фронте!
  type: { type: String, enum: ['text', 'image', 'shape'], required: true },
  content: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  style: Object
});

const slideSchema = new Schema({
  presentationId: { type: Schema.Types.ObjectId, ref: 'Presentation', required: true },
  order: { type: Number, required: true },
  blocks: [blockSchema],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Slide', slideSchema);
