import { sequelize } from "../datasource";
import { User } from "./user"
import { DataTypes } from "sequelize"

/* Task Table */

export const Task = sequelize.define("Task", {
    id:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
})

User.hasMany(Task);
Task.belongsTo(User);
