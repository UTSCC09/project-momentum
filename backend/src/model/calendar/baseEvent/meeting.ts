import { sequelize } from "../../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../../user/user";
import { Project } from "../project";
import { Recursion } from "../utils/recursion";

/* Meeting Table */

export const Meeting = sequelize.define("Meeting", {

    /* Meeting ID */
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
        references:{
            model: User,
            key: 'id',
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

    start_time:{
        type: DataTypes.TIME,
        allowNull: true,
    },

    end_time:{
        type: DataTypes.TIME,
        allowNull: true,
    },
})


User.hasMany(Meeting, {foreignKey: 'uid'});
Meeting.belongsTo(User, {foreignKey: 'uid'});

Project.hasMany(Meeting, {foreignKey: 'pid'});
