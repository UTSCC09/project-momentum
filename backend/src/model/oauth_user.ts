import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { Oauth } from "./oauth";


export const Oauth_User = sequelize.define("Oauth_User", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    // id in oauth
    oauth_id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references:{
            model: Oauth,
            key: 'id',
        },
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    oauth:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            token: "",
            isAuthorizated: false
        },
    }

})

Oauth_User.belongsTo(Oauth, {
    foreignKey: 'oauth_id',
});

Oauth.hasMany(Oauth_User, {
    foreignKey:'oauth_id',
});