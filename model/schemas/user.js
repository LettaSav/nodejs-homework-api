const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const SALT_FACTOR = 6;

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      default: 'free',
      enum: ['free', 'pro', 'premium'],
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    this.password = await bcrypt.hash(this.passowrd, salt);
  }
  next();
});

userSchema.methods.validPassword = async function (password) {
  return await bcrypt.compare(String(password), this.password);
};
const User = mongoose.model('user', userSchema);

module.exports = User;
