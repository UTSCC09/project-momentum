import { sequelize } from "../datasource";
import { DataTypes } from "sequelize"

/*  User Table 
    Doc: https://sequelize.org/docs/v6/core-concepts/model-basics/
*/

export const User = sequelize.define("User", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    googleOauth: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            token: "",
            isAuthorizated: false
        },
    }
})