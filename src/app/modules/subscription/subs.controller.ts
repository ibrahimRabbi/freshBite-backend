import { Request, Response } from "express";
import { subscriptionServices } from "./subs.services";
 
import httpStatus from "http-status";
import { catchAsync } from "../../helper/catchAsync";

const createSubscription = catchAsync(async (req: Request, res: Response) => {
    const result = await subscriptionServices.createSubscription(req.body);
    res.status(httpStatus.CREATED).json({
      success: true,
      status: httpStatus.CREATED,
      message: "Subscription created successfully",
      data: result,
    });
})


const getAllSubscriptions =  catchAsync(async (req: Request, res: Response) => {
    const result = await subscriptionServices.getAllSubscriptions();
    res.status(httpStatus.OK).json({
      success: true,
      status: httpStatus.OK,
      message: "Subscription retrived successfully",
      data: result,
    });
})

const getSubscriptionById =   catchAsync(async (req: Request, res: Response) => {
    const result = await subscriptionServices.getSubscriptionById(req.params?.id);
    res.status(httpStatus.CREATED).json({
      success: true,
      status: httpStatus.CREATED,
      message: "Subscription created successfully",
      data: result,
    });
})

// const updateSubscription = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const result = await subscriptionServices.updateSubscription(id, req.body);
//     if (!result) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         message: "Subscription not found",
//       });
//     }
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Subscription updated successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: error.message || "Something went wrong",
//       error,
//     });
//   }
// };

// const deleteSubscription = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const result = await subscriptionServices.deleteSubscription(id);
//     if (!result) {
//       return res.status(httpStatus.NOT_FOUND).json({
//         success: false,
//         message: "Subscription not found",
//       });
//     }
//     sendResponse(res, {
//       success: true,
//       statusCode: httpStatus.OK,
//       message: "Subscription deleted successfully",
//       data: result,
//     });
//   } catch (error: any) {
//     res.status(httpStatus.BAD_REQUEST).json({
//       success: false,
//       message: error.message || "Something went wrong",
//       error,
//     });
//   }
// };

export const subscriptionController = {
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  // updateSubscription,
  // deleteSubscription,
};