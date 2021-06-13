const app = require('../app');
const db = require('../model/db');
const createFolderIsNotExsist = require('../services/create-dir');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const UPLOAD_DIR = process.env.UPLOAD_DIR;
const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS;

db.then(() => {
  app.listen(PORT, async () => {
    await createFolderIsNotExsist(UPLOAD_DIR);
    await createFolderIsNotExsist(AVATARS_OF_USERS);
    console.log(`Server running. Use our API on port: ${PORT}`);
  });
}).catch(err => {
  console.log(`Server notnrunning. Error message: ${err.message}`);
  process.exit(1);
});
