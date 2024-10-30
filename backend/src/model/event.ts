import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { Users } from "./user";
import { Recursion } from "./recursion";


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
    // user id from Users table
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Users,
            key: 'id',
        },
        
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
    recurring_id:{
        type: DataTypes.STRING,
        allowNull: true,
        references: {
            model: Recursion,
            key: "id",
        },
    },
})

Users.hasMany(Event, {foreignKey: 'uid'});
Event.hasOne(Recursion, {foreignKey: 'recurring_id'});
