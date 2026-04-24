import "dotenv/config"; 
import prismaInstance from "../prismaInstance";
async function main() {
  const animals = [
    "buffalo",
    "elephant",
    "rhino",
    "zebra",
    "lion",
    "hyena",
    "baboon",
  ];

  const roles = ["admin", "user"];

  for (const name of animals) {
    await prismaInstance.animals.create({
      data: { name },
    });
  }

  for (const name of roles) {
    await prismaInstance.roles.create({
      data: { name },
    });
  }
}

main()
  .then(() => prismaInstance.$disconnect())
  .catch((e) => {
    console.error(e);
    prismaInstance.$disconnect();
    process.exit(1);
  });
