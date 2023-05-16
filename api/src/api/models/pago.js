module.exports = (sequelize, DataTypes) => {
    const Pago = sequelize.define(
      "Pago",
      {
        id: {
          type: DataTypes.BIGINT,
          autoIncrement: true,
          primaryKey: true,
        },

        valor: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
  
        fechaEmision: {
            type: DataTypes.DATE,
            allowNull: false,
        }, 
  
        estado: {
          type: DataTypes.STRING(10),
          allowNull: false,
        }, 
        
      },

      { timestamps: false }
    );
  
    Pago.associate = (model) => {
        Pago.belongsTo(model.Group, {
            foreignKey: {
              name: "groupCode",
            },
          });
    };
  
    return Pago;
  };
  