import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import routes from "./routes";
import { automatedNotificationService } from "./services/detection.Service";
import { set } from "zod";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use("/api", routes);

setInterval(() => {
  automatedNotificationService();
}, 3000);

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`app is running on port ${Port}`);
});
