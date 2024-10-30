
import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";

/* Status Table */

export const Status = sequelize.define("Status", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [["Not Started", "Initiated", "Midway", "Nearly Complete", "Complete"]],
        },
        
    },
    number:{
        type: DataTypes.INTEGER,
        allowNull: false,
        validate:{
            isIn: [[0, 25, 50, 75, 100]],
        },
    }
})