import express from "express";
import configViewEngine from "./config/viewEngine";
import initWebRoutes from "./routes/web";

const app = express();

//config viewengine
configViewEngine(app);

//init web routes
initWebRoutes(app);

const PORT = 8000;
app.listen(PORT, () => {
    console.log("web running on:" + PORT);
})