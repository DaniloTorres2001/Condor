module.exports = (sequelize, DataTypes) => {
  const UserGroup = sequelize.define(
    "UserGroup",
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
    },
    { timestamps: false }
  );

  return UserGroup;
};
