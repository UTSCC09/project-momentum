import { sequelize } from "../../../datasource";
import { User } from "../../user/user";
import { DataTypes } from "sequelize";
import { Project } from "../project";


/* Task Table */

export const Task = sequelize.define("Task", {

    /* Task ID */
    id:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },

    /* User(Owner) ID */
    uid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key:'id', 
        },
        onDelete: 'CASCADE',
    },
    
    /* Project ID */
    pid:{
        type: DataTypes.UUID,
        allowNull: true,
        onDelete: 'CASCADE',
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

    deadline:{
        type: DataTypes.DATE,
        allowNull: true,
    },
    
    progress:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
})

User.hasMany(Task, {foreignKey: 'uid'});
Task.belongsTo(User, {foreignKey: 'uid'});
Project.hasMany(Task, {foreignKey: 'pid'});

