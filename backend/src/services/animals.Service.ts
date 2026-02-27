import prismaInstance from "../prismaInstance";

export const addAnimalService = async (name: string, conservationStatus: string, alertPriority: string) => {
    const newAnimal = await prismaInstance.animals.create({
        data: { name, conservationStatus, alertPriority }
    })
    if (!newAnimal) {
        return Promise.reject(new Error("failed to add animal"))
    }
    return newAnimal;   
}

