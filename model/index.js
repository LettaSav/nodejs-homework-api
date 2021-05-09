const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, '/model/contacts.json');
const uniqid = require('uniqid');

const listContacts = async () => {
  const data = await fs.readFile(contactsPath, 'utf8');
  return JSON.parse(data);
};

const getContactById = async contactId => {
  const contacts = await listContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  return contact;
};

const removeContact = async contactId => {
  const contacts = await listContacts();
  const newContacts = contacts.filter(({ id }) => id !== contactId);
  if (contacts.length === newContacts.length) {
    return console.log(`Contact with this ID ${contactId}  is not found!`);
  }
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8',
  );
  return newContacts;
};

const addContact = async body => {
  const contacts = await listContacts();
  const newContact = { id: uniqid(), ...body };
  const newContacts = [...contacts, newContact];
  await fs.writeFile(
    contactsPath,
    JSON.stringify(newContacts, null, 2),
    'utf8',
  );
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(({ id }) => id.toString() === contactId);
  if (index === -1) return;
  contacts[index] = { ...contacts[index], ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2), 'utf8');
  return contacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
