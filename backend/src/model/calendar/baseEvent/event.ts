import { sequelize } from "../../../datasource";
import { DataTypes } from "sequelize";
import { User } from "../../user/user";
import { Recursion } from "../utils/recursion";


/* Event Table */

export const Event = sequelize.define("Event", {

    /* Event ID */
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
    
    start_time:{
        type: DataTypes.DATE,
        allowNull: true,
    },

    end_time:{
        type: DataTypes.DATE,
        allowNull: true,
    },

    recurring:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    
    recurring_id:{
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Recursion,
            key: "id",
        },
    },
})

User.hasMany(Event, {foreignKey: 'uid'});
Event.belongsTo(User, {foreignKey: 'uid'});
Event.hasOne(Recursion, {foreignKey: 'recurring_id'});
