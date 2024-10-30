import { sequelize } from "../../datasource";
import { User } from "../user/user";
import { DataTypes } from "sequelize";
import { Oauth_User } from "../user/oauth_user";
import { Project } from "./project";
import { Status } from "./status";


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
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Status,
            key: 'id',
        },
    },
    project_id:{
        type: DataTypes.STRING,
        allowNull: true,
        references:{
            model: Project,
            key: 'id',
        },
    },
})

User.hasMany(Task, {foreignKey: 'uid'});
Oauth_User.hasMany(Task, {foreignKey: 'uid'});
Project.hasMany(Task, {foreignKey: 'project_id'});

