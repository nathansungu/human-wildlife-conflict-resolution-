import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import routes from "./routes";
import { automatedNotificationService } from "./services/detection.Service";
import { errorHandler } from "./middlewares/errorHandler.Middleware";

const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(cookieparser());
app.use("/api", routes);


setInterval(() => {
  automatedNotificationService();
}, 3000);

app.use(errorHandler);

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`app is running on port ${Port}`);
});
