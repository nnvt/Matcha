import express from "express";
import configViewEngine from "./config/viewEngine.js";
import initWebRoutes from "./routes/index.js";
import bodyParser from "body-parser";
import dotenv from 'dotenv';
import connection from "./config/connectDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

configViewEngine(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

connection();

initWebRoutes(app);

app.listen(PORT, () => {
    console.log(`Web running on: ${PORT}`);
});
