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
    repeat: {
        type: DataTypes.JSON,
        allowNull: false,
    },
})

