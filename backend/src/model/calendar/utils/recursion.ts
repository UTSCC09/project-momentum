import { sequelize } from "../../../datasource";
import { DataTypes } from "sequelize";

/* Recursion Table */

export const Recursion = sequelize.define("Recursion", {

    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    start: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    end: {
        type: DataTypes.DATE,
        allowNull: false,
    },

    /* Need to validate */
    repeat_type: {
        type: DataTypes.ENUM('daily', 'weekly', 'monthly'),
        allowNull: false,
    },

    repeat_interval: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    repeat_on: {
        type: DataTypes.STRING,
        allowNull: true,
    },
})

