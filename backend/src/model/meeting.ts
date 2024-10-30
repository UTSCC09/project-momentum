import { sequelize } from "../datasource";
import { DataTypes } from "sequelize";
import { Users } from "./user";
import { Project } from "./project";
import { Recursion } from "./recursion";

/* Meeting Table */

export const Meeting = sequelize.define("Meeting", {
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
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Users,
            key: 'id',
        },
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
    info: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    // id in project table 
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


Users.hasMany(Meeting, {foreignKey: 'uid'});
Project.hasMany(Meeting, {foreignKey: 'project_id'});
Meeting.hasOne(Recursion, {foreignKey: 'recurring_id'});
