import { RequestHandler } from "express";
import { SettingsModel } from "./settings.model";
import status from "http-status";
import { catchAsync } from "../../helper/catchAsync";


export const createSettingsController: RequestHandler = catchAsync(async (req, res, next) => {

    if (req.user.role !== 'admin') {
        throw new Error("unauthorized to create settings");
    }

    const createdSettings = await SettingsModel.create(req.body);
    if (!createdSettings) {
        throw new Error("Failed to create settings");
    }
    res.status(status.OK).json({
        success: true,
        code: status.OK,
        message: "Settings created successfully",
        data: createdSettings
    });
})


export const getSettingsController: RequestHandler = catchAsync(async (req, res, next) => {

    const createdSettings = await SettingsModel.findById(req.params.id);
    if (!createdSettings) {
        throw new Error("Failed to create settings");
    }
    res.status(status.OK).json({
        success: true,
        code: status.OK,
        message: "Settings created successfully",
        data: createdSettings
    });
})



export const updateSettingsController: RequestHandler = catchAsync(async (req, res, next) => {

    if (req.user.role !== 'admin') {
        throw new Error("unauthorized to update settings");
    }

    if (!req.body?.setting_title) {
        throw new Error("Setting title is required for update");
    }
    
    const updateSettings = await SettingsModel.findOneAndUpdate(
        { setting_title: req.body?.setting_title },
        { value: req.body.value },
        { new: true, runValidators: true }
    );

    if (!updateSettings) {
        throw new Error("Failed to update settings");
    }

    res.status(status.OK).json({
        success: true,
        code: status.OK,
        message: "Settings updated successfully",
        data: updateSettings
    });
})