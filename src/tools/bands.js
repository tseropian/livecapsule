const { PrismaClient } = require("@prisma/client");


(async () => {
    const prisma = new PrismaClient();
    const accounts = await prisma.account.findMany()
    console.log(accounts);
})();