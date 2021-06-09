const { isError } = require('joi');
const User = require('./schemas/user');

const findById = async id => {
  return await User.findOne({ _id: id });
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const create = async options => {
  const user = new User(options);
  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateSubUser = async (id, subscription) => {
  return await User.updateOne({ _id: id }, { subscription });
};

const updateAvatar = async (id, avatarUrl) => {
  return await User.updateOne({ _id: id }, { avatarUrl });
};

module.export = {
  findByEmail,
  findById,
  create,
  updateToken,
  updateSubUser,
  updateAvatar,
};
