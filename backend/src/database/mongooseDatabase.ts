import mongoose from "mongoose";

const connectDatabase = () => {
    mongoose.connect('mongodb://127.0.0.1:27017/CRUD').then(con => {
        console.log(`Mongodb Database connected with HOST: ${con.connection.host} State:${con.connection.readyState}`)
    })
}

export default connectDatabase