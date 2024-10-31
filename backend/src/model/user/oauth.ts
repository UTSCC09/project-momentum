import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "./user";

/* Oauth Table */

export const Oauth = sequelize.define("Oauth", {
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    // restrict on name, update the array if other oauth added
    type:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [["google", "microsoft"]],
        }
    },

    token:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})

User.hasMany(Oauth, { foreignKey: 'userId' });
Oauth.belongsTo(User, { foreignKey: 'userId' });