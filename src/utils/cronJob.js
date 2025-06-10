const cron = require('node-cron');
const ConnectionRequestModel = require('../models/conenctionRequests');
const {subDays,startOfDay,endOfDay} = require('date-fns');
const { run } = require('../utils/sendEmail');

cron.schedule('0 8 * * *',async () => {
    //send emails to all users who have received connection request in last 24 hours

    try {

        const oneDayAgo = subDays(new Date(),1);
        const yesterdayStart = startOfDay(oneDayAgo);
        const yesterdayEnd = endOfDay(oneDayAgo);
        const connectionRequests = await ConnectionRequestModel.find({
            status: "interested",
            createdAt: {
                $gte: yesterdayStart,
                $lte: yesterdayEnd,
            }
        }).populate("fromUserId toUserId")

        const listofEmails = new Set();
        connectionRequests.forEach(request => {
            listofEmails.add(request.toUserId.email);
        });

        const emails = Array.from(listofEmails);

        for (const email of emails){

            const result = await run("Connection Request","You have a new connection request",email)

        }


    } catch (error) {
        console.log(error);
    }
});