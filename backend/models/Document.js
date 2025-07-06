const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Rich text (HTML from WYSIWYG)
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  sharedWith: [{ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    canEdit: { type: Boolean, default: false }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
