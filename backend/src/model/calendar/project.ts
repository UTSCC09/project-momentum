import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../user/user";


/* Project Table */

export const Project = sequelize.define("Project", {

    /* Project ID */
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.STRING,
        allowNull: false,
        // TODO: check each element is in Users
    },
    
    lead: {
        type: DataTypes.UUID,
        allowNull: false,
        references:{
            model: User,
            key: 'id',
        },
    },
})

// Project.belongsTo(User, {foreignKey: 'lead', targetKey: 'id'});