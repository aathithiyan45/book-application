const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true
  },
  genre: {
    type: String,
    default: 'Unknown',
    trim: true
  },
  publishedYear: {
    type: Number,
    default: new Date().getFullYear()
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  coverUrl: {
    type: String,
    default: '',
    trim: true
  },
  readingStatus: {
    type: String,
    enum: ['unread', 'reading', 'completed'],
    default: 'unread'
  },
  tags: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);