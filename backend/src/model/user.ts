import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { Oauth } from "./oauth";

/*  User Table 
    Doc: https://sequelize.org/docs/v6/core-concepts/model-basics/
*/


// Users table containing all users'id, including both Oauth and normal signup
// Work flow: create an id here and use in Oauth_User and User, preventing 
// duplicate ids (very small chance)
export const Users = sequelize.define("Users", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
   
})

// Uset table containning normal singup user only
export const User = sequelize.define("User", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        references:{
            model: Users,
            key: 'id',
        }
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
})



// Oauth_User table containning oauth signup user only
// (id, oauth_id) is primary key, id not unique bc one user can linked to multiple oauth
export const Oauth_User = sequelize.define("Oauth_User", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        references:{
            model: Users,
            key: 'id',
        },
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
    oauth:{
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
            token: "",
            isAuthorizated: false
        },
    }

})

