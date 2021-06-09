const path = require('path');
const fs = require('fs/promises');
const Jimp = require('jimp');

class Upload {
  constructor(AVATARS_OF_USERS) {
    this.AVATARS_OF_USERS = AVATARS_OF_USERS;
  }

  async transformAvatar(pathFile) {
    const file = Jimp.read(pathFile);
    await file
      .autocrop()
      .cover(
        250,
        250,
        Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,
      )
      .writeAsync(pathFile);
  }
  async savaAvatarToStatic({ idUser, pathFile, nameAvatar }) {
    await this.transformAvatar(pathFile);
    const folderUserAvatar = path.join(this.AVATARS_OF_USERS, idUser);
    await createFolderIsNotExist(folderUserAvatar);
    await fs.rename(pathFile, path.join(folderUserAvatar, idUser, nameAvatar));
    const avatarUrl = path.normalize(path.join(idUser, nameAvatar));
    return avatarUrl;
  }
  async deleteOldAvatar(pathFile) {
    try {
      await fs.unlik(pathFile);
    } catch (error) {
      console.error(error.message);
    }
  }
}

module.exports = Upload;
