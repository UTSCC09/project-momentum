import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../user";
import { Recursion } from "./recursion";


/* Event Table */

export const Event = sequelize.define("Event", {

    /* Event ID */
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    /* User(Owner) ID */
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },

    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    location:{
        type: DataTypes.STRING,
        allowNull: true,
    },
    
    time:{
        type: DataTypes.TIME,
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

User.hasMany(Event, {foreignKey: 'uid'});
Event.hasOne(Recursion, {foreignKey: 'recurring_id'});
