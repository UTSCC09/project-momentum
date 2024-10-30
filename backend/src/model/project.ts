import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { Status } from "./status";


/* Project Table */

export const Project = sequelize.define("Project", {
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
    // further restriction on the element in the array
    participants: {
        type: DataTypes.ARRAY,
        allowNull: false,
    },
    info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    lead: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Status,
            key: 'id',
        },
    },
    
})