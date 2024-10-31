import { sequelize } from "../../../datasource";
import { User } from "../../user/user";
import { DataTypes } from "sequelize";
import { Project } from "../project";
import { Status } from "../utils/status";


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
        references:{
            model: Project,
            key: 'id',
        },
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
        type: DataTypes.TIME,
        allowNull: true,
    },
    
    status:{
        type: DataTypes.STRING,
        allowNull: false,
        references:{
            model: Status,
            key: 'id',
        },
    }
})

User.hasMany(Task, {foreignKey: 'uid'});
Task.belongsTo(User, {foreignKey: 'uid'});
Project.hasMany(Task, {foreignKey: 'pid'});
Task.hasOne(Status, {foreignKey: 'status'});

