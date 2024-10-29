import { sequelize } from "../datasource";
import { DataTypes } from "sequelize"

export const User = sequelize.define("User", {
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