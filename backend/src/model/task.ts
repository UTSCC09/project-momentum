import { sequelize } from "../datasource";
import { User } from "./user";
import { DataTypes } from "sequelize";
import { Oauth_User } from "./oauth_user";

/* Task Table */

export const Task = sequelize.define("Task", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    location:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    deadline:{
        type: DataTypes.TIME,
        allowNull: true,
    },
    info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // added later on
    project_id:{
        type: DataTypes.STRING,
        allowNull: true,
    },
})

User.hasMany(Task, {foreignKey: 'uid'});
Oauth_User.hasMany(Task, {foreignKey: 'uid'});
