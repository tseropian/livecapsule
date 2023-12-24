const { PrismaClient } = require("@prisma/client");
const { subYears, format } = require('date-fns');

const { searchSetlist } = require("../lib/setlistfm");

const prisma = new PrismaClient();

(async () => {
    const bands = await prisma.band.findMany()
    const currentDate = new Date();
    const oneYearAgo = subYears(currentDate, 4);
    const oneYearAgoFormatted = format(oneYearAgo, 'dd-MM-yyyy');

    for (let band of bands) {
        const setlist = await searchSetlist(band.name, oneYearAgoFormatted);
        if (setlist && setlist.type) {
            await prisma.setlist.create({
                data: {
                    band: { connect: { id: band.id } },
                    data: setlist
                }
            });
        }
    }
})();