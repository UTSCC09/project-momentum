import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";

/* Oauth Table */

export const Oauth = sequelize.define("Oauth", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
        
    },

    // restrict on name, update the array if other oauth added
    type:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            isIn: [["google", "microsoft"]],
        }
    },

    token:{
        type: DataTypes.STRING,
        allowNull: false,
    }
})
