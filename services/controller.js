const Contacts = require('../model/index');

const listContacts = async (_req, res, next) => {
  try {
    const contacts = await Contacts.listContacts();
    return res.json({
      status: 'Success',
      code: 200,
      message: 'Your Contacts',
      data: {
        contacts,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const contact = await Contacts.getContactById(req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: 200,
        message: 'Here is your requested contact',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const contact = await Contacts.addContact(req.body);
    return res.status(201).json({
      status: 'Success',
      code: 201,
      message: 'You add a new contact!',
      data: {
        contact,
      },
    });
  } catch (e) {
    next(e);
  }
};

const removeContact = async (req, res, next) => {
  try {
    const contact = await Contacts.removeContact(req.params.contactId);
    if (contact) {
      return res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Contact deleted!',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Contact not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const updateContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).lenght === 0) {
      return res.status(404).json({
        status: 'Error',
        code: 400,
        message: 'Missing fields',
      });
    }
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
    );
    if (contact) {
      return res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Contact updated!',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};
const updateStatusContact = async (req, res, next) => {
  try {
    if (Object.keys(req.body).lenght === 0) {
      return res.status(404).json({
        status: 'Error',
        code: 400,
        message: 'missing field favorite',
      });
    }
    const contact = await Contacts.updateStatusContact(
      req.params.contactId,
      req.body,
      req.favorite,
    );
    if (contact) {
      return res.status(200).json({
        status: 'Success',
        code: 200,
        message: 'Contact added to favorite!',
        data: {
          contact,
        },
      });
    } else {
      return res.status(404).json({
        status: 'Error',
        code: 404,
        message: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  updateContact,
  addContact,
  updateStatusContact,
};
