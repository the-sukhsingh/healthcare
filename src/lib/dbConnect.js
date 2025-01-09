import mongoose from "mongoose";

const conncection = {};

async function dbConnect(){ 
    if(conncection.isConnected){
        console.log("Already connected to database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "", {})
        conncection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Error connecting to database", error);
        process.exit(1);
    }

}


export default dbConnect;