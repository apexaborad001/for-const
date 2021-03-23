'use strict';
module.exports = (sequelize, DataTypes) => {
  return sequelize.define('notificationSubscriptions', {
     id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
     },
     user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users', // Refers to table name
        key: 'id', // Refers to column name in table
      },
      onDelete: "cascade",
      onUpdate: "cascade"
     },
	  token: {
		type: DataTypes.STRING,
	  },
	  endpoint: {
		type: DataTypes.TEXT,
	  },
	  auth_key: {
		type: DataTypes.TEXT,
	  },
	  status: {
		type: DataTypes.TINYINT,
		allowNull: false,
		defaultValue: 1
	  },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
     }
  }, {
    tableName: 'notificationSubscriptions'
  });
  
};
