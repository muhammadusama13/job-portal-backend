const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JobSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: false,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);
