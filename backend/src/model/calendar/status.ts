
import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";

/* Status Table */

export const Status = sequelize.define("Status", {

    /* Task ID */
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    // name and number matched, can directly pass these values to frontend 
    progress:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [["Not Started", "Initiated", "Midway", "Nearly Complete", "Complete"]],
        },
    },

    progress_number:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isIn: [[0, 25, 50, 75, 100]],
        },
    }
})