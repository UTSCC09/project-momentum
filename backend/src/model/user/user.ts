import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { Oauth } from "./oauth";

/*  User Table 
    Doc: https://sequelize.org/docs/v6/core-concepts/model-basics/
*/

// Uset table containning normal singup user only
export const User = sequelize.define("User", {

    /* User ID */
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    username: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },

    password: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})