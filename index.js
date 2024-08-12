import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import auth from "./router/auth.js"
import users from "./router/users.js"
import product from "./router/product.js"
import cookieParser from 'cookie-parser'; 
import session from 'express-session';

const app = express();
dotenv.config();

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}));


app.use(express.json());

app.use("/auth",auth)
app.use("/users",users)
app.use("/product",product)
app.use("/userProduct",auth)

mongoose.connect(process.env.MONGODB_URL);

mongoose.connection.on("connected", () => {
  console.log("Database Connected");
});

mongoose.connection.on("error", (e) => {
  console.log("Error - ", e);
});

const PORT = process.env.PORT || 5000;                  

app.listen(PORT, () => {
  console.log(`Server started on PORT ${PORT}`);
});



