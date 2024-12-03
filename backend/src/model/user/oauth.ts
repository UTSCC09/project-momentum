import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "./user";

/* Oauth Table */

export const Oauth = sequelize.define("Oauth", {
    userId: {
        type: DataTypes.UUID,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },

    oauthId:{
        type: DataTypes.STRING,
        allowNull: false,
    },
})

User.hasMany(Oauth, { foreignKey: 'userId' });
Oauth.belongsTo(User, { foreignKey: 'userId' });