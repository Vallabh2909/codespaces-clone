import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./db/index.js";
dotenv.config({
    path: "../.env",
  });
connectDB()
.then(()=>{
    app
    .listen(process.env.PORT,()=>{
        console.log(`Server running on port ${process.env.PORT}`);
    })
    .on("error",(error)=>{
        console.error(`Error: ${error.message}`);
        process.exit(1);
    });
})