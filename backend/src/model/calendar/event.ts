import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../user/user";
import { Oauth_User } from "../user/oauth_user";

/* Event Table */

export const Event = sequelize.define("Event", {
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
    time:{
        type: DataTypes.TIME,
        allowNull: true,
    },
    info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // TODO: get from recursion table
    recurring:{
        type: DataTypes.STRING,
        allowNull: true,
    }
})

User.hasMany(Event, {foreignKey: 'uid'});
Oauth_User.hasMany(Event, {foreignKey: 'uid'});