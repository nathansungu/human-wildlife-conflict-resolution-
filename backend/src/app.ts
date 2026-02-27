import express from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import axios from "axios";
import routes from "./routes";
import { sendNotificationService } from "./services/detection.Service";
const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieparser());
app.use("/api", routes);

// const predicted = async () => {
//   try {
//     const response = await axios.get("http://localhost:5000/detect-animals");
//     const data: Record<string, any[]> = response.data.results;

//     for (const [cameraId, detections] of Object.entries(data)) {
//       if (response.status == 200 && detections.length > 0) {
//         for (const detection of detections) {
//           sendNotificationService(
//             detection.class_name,
//             cameraId,
//             detection.confidence,
//           );
//         }
//       }
//     }
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching predictions:");
//   }
// };
//test sendnotification service 

sendNotificationService("Elephant", "camera1", 0.95)
setInterval(sendNotificationService, 30000);
// setInterval(predicted, 30000);

const Port = process.env.PORT || 3000;
app.listen(Port, () => {
  console.log(`app is running on port ${Port}`);
});
