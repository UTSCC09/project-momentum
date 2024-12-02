import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbUsername = process.env.MYSQL_USERNAME || 'root'
const dbPassword = process.env.MYSQL_PASSWORD
const dbHost = process.env.VM_HOST || 'localhost'

export const sequelize = new Sequelize('CSCC09', dbUsername, dbPassword, {
    host: dbHost, 
    dialect: 'mysql',
    logging: false
})

export async function connectDB(){
    try {
        await sequelize.authenticate();
        await sequelize.sync();

        console.log("success connect to database");
    } catch(error) {
        console.log(error);
        console.error("failed connect to database", error);
    }
    return null;
}