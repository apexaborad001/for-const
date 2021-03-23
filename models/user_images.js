'use strict';
module.exports = (sequelize, DataTypes) => {
  const user_images = sequelize.define('user_images', {
    imagePath: { type: DataTypes.STRING, field: 'image_path' },
    userId: { type: DataTypes.INTEGER, field: 'user_id' },
    imageType: { type: DataTypes.TEXT, field: 'image_type' },
    name: { type: DataTypes.TEXT, field: 'name' }
  }, {});
  user_images.associate = function(models) {
    user_images.belongsTo(models.user);
  };
  user_images.getProfileImage = async(req) => {
    return `${req.constants.USER_IMAGE_URL}${this.imagePath}/${this.name}`;
  }

  return user_images;
};
