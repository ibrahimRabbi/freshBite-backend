import { Tsubscription } from "./subs.interface";
import subscriptionModel from "./subs.model";

export const subscriptionServices = {
  createSubscription: async (payload: Tsubscription) => {
    
    const checkBefore = await subscriptionModel.findOne({ plan: payload.plan, isDeleted: { $ne: true } });
    if (checkBefore){
      throw new Error('Subscription plan already exists');
    }
    
    const result = await subscriptionModel.create(payload);
    return result;
  },

  getAllSubscriptions: async () => {
    const result = await subscriptionModel.find({ isDeleted: { $ne: true } });
    return result;
  },

  getSubscriptionById: async (id: string) => {
    const result = await subscriptionModel.findOne({ _id: id, isDeleted: { $ne: true } });
    return result;
  },

  updateSubscription: async (id: string, payload: Partial<Tsubscription>) => {
    const result = await subscriptionModel.findByIdAndUpdate(
      { _id: id },
      payload,
      { new: true, runValidators: true }
    );
    return result;
  },

  deleteSubscription: async (id: string) => {
    const result = await subscriptionModel.findByIdAndUpdate(
      { _id: id },
      { isDeleted: true },
      { new: true }
    );
    return result;
  },
};