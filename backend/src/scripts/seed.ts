import prismaInstance from "../prismaInstance";
async function main() {
  const animals = [
    "buffalo",
    "elephant",
    "rhino",
    "zebra",
    "lion",
    "hyena",
    "baboon"
  ]

  for (const name of animals) {
    await prismaInstance.animals.upsert({
      where: { name },
      update: {},
      create: { name }
    })
  }
}

main()
  .then(() => prismaInstance.$disconnect())
  .catch((e) => {
    console.error(e)
    prismaInstance.$disconnect()
    process.exit(1)
  })