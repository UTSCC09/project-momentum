import { sequelize } from "../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../user/user";
import { Project } from "./project";
import { Recursion } from "./recursion";

/* Meeting Table */

export const Meeting = sequelize.define("Meeting", {

    /* Meeting ID */
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
        references:{
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

    start_time:{
        type: DataTypes.TIME,
        allowNull: true,
    },

    end_time:{
        type: DataTypes.TIME,
        allowNull: true,
    },
    
    project_id:{
        type: DataTypes.STRING,
        allowNull: true,
        references:{
            model: Project,
            key: 'id',
        },
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


User.hasMany(Meeting, {foreignKey: 'uid'});
Project.hasMany(Meeting, {foreignKey: 'project_id'});
Meeting.hasOne(Recursion, {foreignKey: 'recurring_id'});
