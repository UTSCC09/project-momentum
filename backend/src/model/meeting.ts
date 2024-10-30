import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { User } from "./user";
import { Oauth_User } from "./oauth_user";

/* Meeting Table */

export const Meeting = sequelize.define("Meeting", {
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
    start_time:{
        type: DataTypes.TIME,
        allowNull: true,
    },
    end_time:{
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


User.hasMany(Meeting, {foreignKey: 'uid'});
Oauth_User.hasMany(Meeting, {foreignKey: 'uid'});