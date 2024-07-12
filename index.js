import express from "express";
import cors from "cors";
import { router as EventRouter } from "./src/controllers/event-controller.js"
import { router as UserRouter } from "./src/controllers/user-controller.js"
import { router as ProvinceRouter } from "./src/controllers/province-controller.js"

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use("/front", express.static("public"));

app.use("/api/event", EventRouter);
app.use("/api/user", UserRouter);
app.use("/api/province", ProvinceRouter);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})