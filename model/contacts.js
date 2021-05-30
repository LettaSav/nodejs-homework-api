const { options } = require('joi');
const Contact = require('./schemas/contact');

const listContacts = async (userId, query) => {
  const { sortBy, sortByDesc, sub, page = '1', limit = '20' } = query;
  const optionSearch = { owner: userId };

  if (sub) {
    options.descriptions = { $all: [sub] };
  }
  const results = await Contact.paginate(optionSearch, {
    limit,
    offset,
    sort: {
      ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
      ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
    },
    populate: {
      path: 'owner',
      select: 'email subscription -_id',
    },
  });
  const { docs: contacts, totalDocs: total } = results;
  return { total: total.toString(), page, limit, contacts };
};

const getContactById = async (userId, contactId) => {
  const result = await (
    await Contact.findOne({ _id: contactId, owner: userId })
  ).populate({ path: 'owner', select: 'name, email -_id ' });
  return result;
};

const removeContact = async (userId, contactId) => {
  const result = await Contact.findByIdAndRemove({
    _id: contactId,
    owner: userId,
  });
  return result;
};

const addContact = async body => {
  const result = await Contact.create(body);
  return result;
};

const updateContact = async (userId, contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    { ...body },
    { new: true },
  );
  return result;
};
const updateStatusContact = async (contactId, body) => {
  const result = await Contact.findOneAndUpdate(
    { _id: contactId },
    { ...body },
    { favorite: true },
    { new: true },
  );
  return result;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
