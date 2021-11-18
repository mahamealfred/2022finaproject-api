import express from "express"
import cors from "cors";
import routers from "./routers"


require('dotenv').config();

const app=express();

app.use(express.json());
app.use(cors());
app.use(routers);

const PORT=5000


app.listen(PORT,()=>{
    console.log(`Sever is ready on port http://localhost:${PORT}`);
})