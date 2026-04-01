import { tr } from "zod/v4/locales";
import prismaInstance from "../prismaInstance";
import {
  nodemailerTransporter,
  celcomAfricaSms,
} from "../utility/nodemailer_afrcastalking";
import axios from "axios";

export const allDetectionsService = async (
  speciesId?: string,
  cameraId?: string,
  date?: Date,
) => {
  const detections = await prismaInstance.animalLogs.findMany({
    where: {
      animalId: speciesId && speciesId,
      cameraId: cameraId && cameraId,
      createdAt: date
        ? {
            gte: new Date(date.setHours(0, 0, 0, 0)),
            lt: new Date(date.setHours(23, 59, 59, 999)),
          }
        : undefined,
    },
    select: {
      animal: { select: { name: true } },
      camera: { select: { name: true, location: true } },
      confidence: true,
      isVerified: true,
      createdAt: true,
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
    return Promise.reject(new Error("failed to add records"));
  }
  return newRecord;
};

export const recordAnimalLog = async (
  name: string,
  date: Date,
  cameraId: string,
  count: number,
) => {
  const record = await prismaInstance.dailyReports.findFirst({
    where: { speciesName: name, date: date, cameraId: cameraId },
  });

  if (record) {
    await prismaInstance.dailyReports.update({
      where: { id: record.id },
      data: { count: record.count + count },
    });
    return;
  }

  const newRecord = await prismaInstance.dailyReports.create({
    data: { cameraId: cameraId, speciesName: name, date: date, count: count },
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
  if (!cameraId) throw new Error("cameraId is required");

  const [camera, animal, users] = await Promise.all([
    prismaInstance.cameras.findUnique({ where: { id: cameraId } }),
    prismaInstance.animals.findFirst({ where: { name: animalName } }),
    prismaInstance.user.findMany({
      where: { subscribed: true },
      select: { email: true, phone: true },
    }),
  ]);

  const message = `
🚨 Wildlife Alert! 🚨

Species: ${animal?.name}
Location: ${camera?.location}
Camera: ${camera?.name}
Confidence: ${(confidence * 100).toFixed(2)}%
Detected at: ${new Date().toLocaleString()}
`;
  await recordAlertService(animalName, cameraId, message);
  await Promise.allSettled(
    users.map((user) => {
      const tasks = [];
      if (user.email) {
        tasks.push(
          nodemailerTransporter.sendMail({
            from: `"Wildlife Monitoring System" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Wildlife Alert: ${animal?.name} detected`,
            text: message,
          }),
        );
      }
      if (user.phone) {
        tasks.push(celcomAfricaSms(message, user.phone));
      }
      return Promise.allSettled(tasks);
    }),
  );

  await recordAlertService(animalName, cameraId, message);
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
          } catch (error) {
            console.error("Failed to record detection:", error);
            continue;
          }
          try {
            await sendNotificationService(
              detection.class_name,
              cameraId,
              detection.confidence,
            );
            
           
          } catch (innerError) {
            console.error("Failed processing detection:", innerError);
          }
        }
      }
    }
  } catch (error: any) {
    console.log("Failed to fetch records ");
  }
};

// get reports for dashboard
export const getReportsService = async () => {
  const dailyTotal = await prismaInstance.dailyReports.groupBy({
    by: ["speciesName", "date"],
    _sum: { count: true },
    orderBy: { date: "desc" },
  });

  const monthlyRaw = await prismaInstance.dailyReports.findMany({
    select: { speciesName: true, date: true, count: true },
  });

  const monthlyMap: Record<
    string,
    { speciesName: string; month: string; count: number }
  > = {};

  monthlyRaw.forEach((item) => {
    const month = new Date(item.date).toISOString().slice(0, 7);
    const key = `${item.speciesName}||${month}`;

    if (!monthlyMap[key]) {
      monthlyMap[key] = { speciesName: item.speciesName, month, count: 0 };
    }
    monthlyMap[key].count += item.count;
  });

  const monthlyTotal = Object.values(monthlyMap);

  const notificationsSent = await prismaInstance.alerts.count();

  const totalDetections = await prismaInstance.animalLogs.count();

  const topCamera = await prismaInstance.animalLogs.groupBy({
    by: ["cameraId"],
    _count: { cameraId: true },
    orderBy: { _count: { cameraId: "desc" } },
    take: 1,
  });

  const topSpecies = await prismaInstance.dailyReports.groupBy({
    by: ["speciesName"],
    _sum: { count: true },
    orderBy: { _sum: { count: "desc" } },
    take: 1,
  });

  const highPriorityAlerts = await prismaInstance.alerts.count({
    where: {
      animal: {
        alertPriority: "high",
      },
    },
  });

  return {
    dailyTotal,
    monthlyTotal,
    notificationsSent,
    totalDetections,
    topCamera,
    topSpecies,
    highPriorityAlerts,
  };
};
