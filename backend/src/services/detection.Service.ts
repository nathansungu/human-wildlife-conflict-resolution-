import prismaInstance from "../prismaInstance";
import {
  nodemailerTransporter,
  africasTalkingClient,
} from "../utility/nodemailer_afrcastalking";
const sms = africasTalkingClient.SMS;

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
  animalId: string,
  cameraId: string,
  confidence: number,
) => {
  const newRecord = await prismaInstance.animalLogs.create({
    data: { animalId, cameraId, confidence },
  });
  if (!newRecord) {
    return Promise.reject(new Error("failed to add record"));
  }
  return newRecord;
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
  const camera = await prismaInstance.cameras.findUnique({
    where: { id: cameraId },
  });
  const animal = await prismaInstance.animals.findFirst({
    where: { name: animalName },
  });

  const users =
    await prismaInstance.user.findMany({
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
      console.log(`Sending email to ${user.email} for ${animalName} detection...`);
       await nodemailerTransporter.sendMail({
        from: `"Wildlife Monitoring System" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: `Wildlife Alert: ${animal?.name} detected`,
        text: message,
      });
    }

    // // Send SMS
    // if (user.phone) {
    //   await sms.send({
    //     to: [user.phone],
    //     from: "Wildlife",
    //     message,
    //   });
    // }
  }
  console.log(
    `Notifications sent for ${animalName} detected at camera ${cameraId}`,
  );
};
