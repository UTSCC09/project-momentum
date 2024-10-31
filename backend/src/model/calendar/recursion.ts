import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";

/* Recursion Table */

export const Recursion = sequelize.define("Recursion", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    meeting_id:{
        type: DataTypes.STRING,
        allowNull: false,
        // TODO: restrict to meeting id or event id
    },
    // can start any time
    start: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    // certain value
    repeat: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isIn: [["daily", "weekly", "monthly", "yearly"]]
        }
    },

    // TODO: Figure out how these field should be stored and restriced
    // depends on repeat
    every: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // depends on
    on: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    // can end any time
    end: {
        type: DataTypes.TIME,
        allowNull: false,
    }
    
})

