'use strict';

import mongoose from 'mongoose-fill';

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    index: true
  },
  phone: {
    type: String
  },
  picture: {
    type: String
  }
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

export default mongoose.model('Contact', ContactSchema);
