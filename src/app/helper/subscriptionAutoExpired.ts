// jobs/subscriptionJob.ts
import cron from "node-cron";
import userModel from "../modules/user/user.model";



export const SubscriptionWillBeExpired = () => {
    // prottek ghontay check
    cron.schedule("0 * * * *", async () => {
        const now = new Date();

        try {
            const result = await userModel.updateMany({ subscriptionStatus: "active", expiredAt: { $lte: now } },
                { $set: { subscriptionStatus: "inactive", planType: 'guest', expiredAt:null } },
                { runValidators: true, context: 'query' }
            );

            if (result.modifiedCount > 0) {
                console.log(`✅ ${result.modifiedCount} subscription(s) expired`);
            }
        } catch (err) {
            console.error("❌ Error updating subscriptions:", err);
        }
    });
};
