import express  from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import setRoutes from "./routes";
import bodyParser from "body-parser";

dotenv.config(); //configure env files 

const app = express();  //Initialize express.


app.set("port",process.env.PORT)    


mongoose.connect(
    process.env.MONGODB_URI,
    {useNewUrlParser: true}
);

const db = mongoose.connection;


db.on("error", console.error.bind(console, "connection error:"));

db.once("open", () => {
    console.log("connected to mongodb.")

    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())

    setRoutes(app);

    app.listen(app.get("port"), () => {
        console.log("CgBackend listen on "+process.env.PORT);
    })
})

