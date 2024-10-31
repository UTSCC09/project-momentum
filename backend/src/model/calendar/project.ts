import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { Status } from "./status";
import { User } from "../user/user";


/* Project Table */

export const Project = sequelize.define("Project", {

    /* Project ID */
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

    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    // further restriction on the element in the array
    participants: {
        type: DataTypes.ARRAY,
        allowNull: false,
        // TODO: check each element is in Users
    },
    
    lead: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: User,
            key: 'id',
        },
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

// Leader can lead multiple projects
User.hasMany(Project, {foreignKey: 'lead'});