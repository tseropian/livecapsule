const { PrismaClient } = require("@prisma/client");
const {getFollowedArtists} = require("../lib/spotify");
const prisma = new PrismaClient();

const upsertRecord = async (modelKey, record) => {

    const model = prisma[modelKey];
    
    const existingRecord = await model.findMany({
        where: { name: record.name }
    });
      
    if (existingRecord.length > 0) {
        console.log('Existing Record', existingRecord[0].name)  
        return existingRecord[0];
    } else {
        const newRecord = await model.create({
            data: {
                name: record.name,
                data: {genres: record.genres}
            }
        });      
        console.log('New Record', newRecord)
        return newRecord;
    }
};

(async () => {
    const accounts = await prisma.account.findMany()

    for (let account of accounts) {
        const [user] = await prisma.user.findMany({where: {id: account.userId}});
        let {items, next} = await getFollowedArtists(account);
        console.log(items)
        let followedArtists = items;
        while (next) {
            const nextFollowedArtists = await getFollowedArtists(account, next);
            followedArtists = [...items, ...nextFollowedArtists.items];
            next = nextFollowedArtists.next;
        }
        console.log(followedArtists.length)
        for (let artist of followedArtists) {
           const band = await upsertRecord('band', artist);
            console.log({
                bandId: band.id,
                userId: account.userId
            })

            const existingBandUser = await prisma.bandUser.findMany({where: {user_id: account.userId, band_id: band.id}});
            if (existingBandUser.length === 0) {
                await prisma.bandUser.create({data: 
                    {
                        band: { connect: { id: band.id } },
                        user: { connect: { id: user.id } }
                    }
                });
            } else {
                console.log('Band User already exists', existingBandUser)
            }
            
        }
    }
})();