import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { ShoppingList } from "./shopping.model";
import status from "http-status";
import { uploadImage } from "../../helper/imageUploader";



export const createShoppingListController: RequestHandler = catchAsync(async (req, res, next) => {
  try {
    // Check if user is authorized to create a shopping list
    if (!req?.user?._id) {
      throw new Error('Unauthorized Access - User ID required');
    }

    // Set the userId from the authenticated user
    req.body.userId = req.user._id;

    // Handle cover image upload if provided
    if (req?.file?.path) {
      const imageNamePrefix = `shoppingList_${Math.random().toString().split('.')[1]}`;
      const coverImageUrl = await uploadImage(req.file.path, imageNamePrefix);
      req.body.coverImages = coverImageUrl.secure_url;
    } else if (!req.body.coverImages) {
      throw new Error('Cover image is required');
    }

    // Create the shopping list
    const creating = await ShoppingList.create(req?.body);

    if (!creating) {
      throw new Error('Failed to create shopping list');
    }

    res.status(status.OK).json({
      success: true,
      status: status.OK,
      message: 'Shopping list created successfully',
      data: creating
    });
  } catch (err: any) {
    throw new Error(err?.message);
  }
});

export const getMyShoppingListsController: RequestHandler = catchAsync(async (req, res, next) => {
  // Only return shopping lists for the authenticated user
  const finding = await ShoppingList.find({
    userId: req?.user?._id,
    isDeleted: { $ne: true }
  }).populate('list.ingredient');

  if (!finding) {
    throw new Error('Failed to get shopping lists');
  }

  res.status(status.OK).json({
    success: true,
    status: status.OK,
    message: 'Shopping lists retrieved successfully',
    data: finding
  });
});

export const getSingleShoppingListController: RequestHandler = catchAsync(async (req, res, next) => {
  const finding = await ShoppingList.findById(req?.params?.id).populate('list.ingredient');

  if (!finding || finding.isDeleted) {
    throw new Error('Failed to get shopping list');
  }

  res.status(status.OK).json({
    success: true,
    status: status.OK,
    message: 'Shopping list retrieved successfully',
    data: finding
  });
});

export const updateShoppingListController: RequestHandler = catchAsync(async (req, res, next) => {

  const updating = await ShoppingList.findByIdAndUpdate(
    req?.params?.id,
    req.body,
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updating) {
    throw new Error('Failed to update shopping list');
  }

  res.status(status.OK).json({
    success: true,
    status: status.OK,
    message: 'Shopping list updated successfully',
    data: updating
  });
});


export const deleteShoppingListController: RequestHandler = catchAsync(async (req, res, next) => {
  
  
  // if (req?.user?.role !== 'admin') {
  //   throw new Error('Unauthorized Access - Only owner or admin can delete');
  // }

  const updating = await ShoppingList.findByIdAndUpdate(
    req?.params?.id,
    { isDeleted: true },
    { new: true, runValidators: true, context: 'query' }
  );

  if (!updating) {
    throw new Error('Failed to delete shopping list');
  }

  res.status(status.OK).json({
    success: true,
    status: status.OK,
    message: 'Shopping list deleted successfully',
    data: updating
  });
});

// export const markShoppingListAsDoneController: RequestHandler = catchAsync(async (req, res, next) => {
//   // Only allow the owner to mark their shopping list as done
//   if (req?.user?._id?.toString() !== req.body.userId && req?.user?.role !== 'admin') {
//     throw new Error('Unauthorized Access - Only owner or admin can mark as done');
//   }

//   const updating = await ShoppingList.findByIdAndUpdate(
//     req?.params?.id,
//     { isDone: req.body.isDone || true },
//     { new: true, runValidators: true, context: 'query' }
//   );

//   if (!updating) {
//     throw new Error('Failed to update shopping list status');
//   }

//   res.status(status.OK).json({
//     success: true,
//     status: status.OK,
//     message: `Shopping list marked as ${req.body.isDone ? 'done' : 'not done'} successfully`,
//     data: updating
//   });
// });