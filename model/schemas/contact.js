const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema, SchemaTypes } = mongoose;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: String,
      default: 'free',
      enum: ['free', 'pro', 'premium'],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: 'user',
    },
  },

  {
    versionKey: false,
  },
);

contactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model('contact', contactSchema);

module.exports = Contact;
