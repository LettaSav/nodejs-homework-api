const Contacts = require('../model/contacts');

const { HttpCode } = require('../services/constants');

const listContacts = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { contacts, total, limit, offset } = await Contacts.listContacts(
      userId,
      req.query,
    );
    return res.json({
      status: 'Success',
      code: HttpCode.OK,
      message: 'Your Contacts',
      data: {
        total,
        contacts,
        limit,
        offset,
      },
    });
  } catch (e) {
    next(e);
  }
};

const getContactById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.getContactById(userId, req.params.contactId);
    if (contact) {
      return res.json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Here is your requested contact',
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
        message: 'Not found',
      });
    }
  } catch (e) {
    next(e);
  }
};

const addContact = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const contact = await Contacts.addContact({ ...req.body, owner: userId });
    return res.status(HttpCode.CREATED).json({
      status: 'Success',
      code: HttpCode.CREATED,
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
    const userId = req.user.id;
    const contact = await Contacts.removeContact(userId, req.params.contactId);
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Contact deleted!',
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
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
    const userId = req.user.id;
    const contact = await Contacts.updateContact(
      req.params.contactId,
      req.body,
      userId,
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
    const userId = req.user.id;
    const contact = await Contacts.updateStatusContact(
      req.params.contactId,
      req.body,
      req.favorite,
      userId,
    );
    if (contact) {
      return res.status(HttpCode.OK).json({
        status: 'Success',
        code: HttpCode.OK,
        message: 'Contact added to favorite!',
        data: {
          contact,
        },
      });
    } else {
      return res.status(HttpCode.NOT_FOUND).json({
        status: 'Error',
        code: HttpCode.NOT_FOUND,
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
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
};
