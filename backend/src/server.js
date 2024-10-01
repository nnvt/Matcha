import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8080;

//config viewengine
configViewEngine(app);

//init web routes
initWebRoutes(app);

app.listen(PORT, () => {
    console.log("web running on:" + PORT);
})