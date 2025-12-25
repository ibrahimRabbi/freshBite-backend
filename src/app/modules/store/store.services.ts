import { TStore } from './store.interface';
import StoreModel from './store.model';

// Create a new store item
const createStoreIntoDB = async (payload: TStore) => {
  const result = await StoreModel.create(payload);
  return result;
};

// Get all store items
const getAllStoreFromDB = async () => {
  const result = await StoreModel.find(); // The pre-find middleware will exclude soft-deleted items
  return result;
};

// Get a single store item by ID
const getSingleStoreFromDB = async (id: string) => {
  const result = await StoreModel.findById(id); // The pre-find middleware will exclude soft-deleted items
  return result;
};

// Update a store item
const updateStoreIntoDB = async (id: string, payload: Partial<TStore>) => {
  const result = await StoreModel.findByIdAndUpdate(
    { _id: id },
    payload,
    { new: true, runValidators: true }
  );
  return result;
};

// Delete a store item (soft delete)
const deleteStoreFromDB = async (id: string) => {
  const result = await StoreModel.findByIdAndUpdate(
    { _id: id },
    { isDeleted: true },
    { new: true }
  );
  return result;
};

export const StoreServices = {
  createStoreIntoDB,
  getAllStoreFromDB,
  getSingleStoreFromDB,
  updateStoreIntoDB,
  deleteStoreFromDB,
};