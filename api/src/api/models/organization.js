module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    "Organization",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.BIGINT,
      },
      code: {
        primaryKey: true,
        type: DataTypes.STRING(25),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      
    },
    { timestamps: false }
  );

  Organization.associate = (model) => {
    Organization.hasMany(model.Group, {
      foreignKey: "codeOrganization",
    });
  };

  return Organization;
};
