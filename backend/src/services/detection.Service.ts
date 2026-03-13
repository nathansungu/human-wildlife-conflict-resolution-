import prismaInstance from "../prismaInstance";
import {
  nodemailerTransporter,
  celcomAfricaSms,
} from "../utility/nodemailer_afrcastalking";
import axios from "axios";

export const allDetectionsService = async (
  speciesId?: string,
  cameraId?: string,
) => {
  const detections = await prismaInstance.animalLogs.findMany({
    where: {
      animalId: speciesId && speciesId,
      cameraId: cameraId && cameraId,
      isVerified: true,
    },
  });
  if (!detections) {
    return Promise.reject(new Error("failed to load records"));
  }
  return detections;
};

export const recordDetectionService = async (
  name: string,
  cameraId: string,
  confidence: number,
) => {
  const getAnimalId = await prismaInstance.animals.findFirst({
    where: { name: name },
    select: { id: true },
  });
  if (!getAnimalId) {
    return Promise.reject(new Error("animal not found"));
  }

  const newRecord = await prismaInstance.animalLogs.create({
    data: { animalId: getAnimalId?.id, cameraId, confidence },
  });
  if (!newRecord) {
    return Promise.reject(new Error("failed to add record"));
  }
  return newRecord;
};

export const recordAnimalLog = async (
  name: string,
  date: Date,
  cameraId: string,
  number: number,
) => {
  const record = await prismaInstance.dailyReports.findFirst({
    where: { speciesName: name, date: date, cameraId: cameraId },
  });

  if (record) {
    await prismaInstance.dailyReports.update({
      where: { id: record.id },
      data: { count: record.count + number },
    });
  }

  const newRecord = await prismaInstance.dailyReports.create({
    data: { cameraId: cameraId, speciesName: name, date: date, count: number },
  });
  if (!newRecord) {
    return Promise.reject(new Error("failed to add record"));
  }
};

// record alerts
const recordAlertService = async (
  animalName: string,
  cameraId: string,
  message: string,
) => {
  const newRecord = await prismaInstance.alerts.create({
    data: { animalName, cameraId, message },
  });
  if (!newRecord) {
    return Promise.reject(new Error("failed to add record"));
  }
  return newRecord;
};
//get all records for a specific day
export const getDailyReportService = async (date?: Date) => {
  const records = await prismaInstance.dailyReports.findMany({
    where: { date: date && date },
  });
  return records;
};

export const verifyDetectionService = async (
  id: string,
  isVerified: boolean,
) => {
  const updatedRecord = await prismaInstance.animalLogs.update({
    where: { id },
    data: { isVerified },
  });
  if (!updatedRecord) {
    return Promise.reject(new Error("failed to update record"));
  }
  return updatedRecord;
};

export const sendNotificationService = async (
  animalName: string,
  cameraId: string,
  confidence: number,
) => {
  if (!cameraId) {
    throw new Error("cameraId is required");
  }
  const camera = await prismaInstance.cameras.findUnique({
    where: { id: cameraId },
  });
  const animal = await prismaInstance.animals.findFirst({
    where: { name: animalName },
  });

  const users = await prismaInstance.user.findMany({
    where: { subscribed: false },
    select: { email: true, phone: true },
  });
  const message = `
    🚨 Wildlife Alert! 🚨

Species: ${animal?.name}
Location: ${camera?.location}
Camera: ${camera?.name}
Confidence: ${(confidence * 100).toFixed(2)}%

Detected at: ${new Date().toLocaleString()}
`;
  for (const user of users) {
   
    console.log("Sending notification to user:", user.email);
    if (user.email) {
      console.log(
        `Sending email to ${user.email} for ${animalName} detection...`,
      );
      await nodemailerTransporter.sendMail({
        from: `"Wildlife Monitoring System" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Wildlife Alert: ${animal?.name} detected`,
        text: message,
      });
      
      
    }

    // // Send SMS
    // if (user.phone) {
    //   //send via phone gate way
    //   await axios.post(
    //     "http://10.10.255.17:8080/send-sms",
    //     {
    //       phone: user.phone,
    //       message: message,
    //     },
    //   );
    // }

    // via calcom Africa
    if (user.phone) {
     await celcomAfricaSms(message, user.phone);
    }
    
    await recordAlertService(animalName, cameraId, message);
  }
  
};

export const automatedNotificationService = async () => {
  try {
    const response = await axios.get("http://localhost:5000/detect-animals");

    if (response.status !== 200) {
      console.warn("Detection API returned 200:", response.status);
      return;
    }

    const results: Record<string, any[]> = response.data.results;

    for (const [cameraId, detections] of Object.entries(results)) {
      if (detections.length > 0) {
        for (const detection of detections) {
          try {
            await sendNotificationService(
              detection.class_name,
              cameraId,
              detection.confidence,
            );

            await recordDetectionService(
              detection.class_name,
              cameraId,
              detection.confidence,
            );
            // modifydate to only include the day not time
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            await recordAnimalLog(
              detection.class_name,
              today,
              cameraId,
              detection.number,
            );
          } catch (innerError) {
            console.error("Failed processing detection:", innerError);
          }
        }
      }
    }
  } catch (error: any) {
    console.error("Detection API failed:", error.message);
  }
};


