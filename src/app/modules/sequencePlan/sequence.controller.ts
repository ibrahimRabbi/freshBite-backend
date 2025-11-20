import { RequestHandler } from "express";
import { catchAsync } from "../../helper/catchAsync";
import { SequenceMealPlanModel } from "./sequence.model";
import status from "http-status";
import { TsequenceMealPlan } from "./sequence.interface";


export const sequenceMealCreateController:RequestHandler = catchAsync(async(req,res , next)=>{
     
    const creating = await SequenceMealPlanModel.create({userId:req?.user?._id, ...req?.body})
    if(!creating){
        throw new Error('faild to create saved meal plan')
    }

    res.status(status.OK).json({
        success : true,
        status : status.OK,
        messaage : 'Saved Meal Plan Created Successfully',
        data : creating
    })
     
})


export const NestedMealCreateController:RequestHandler = catchAsync(async(req,res , next)=>{
     
     const data:Partial<TsequenceMealPlan> = {
        userId : req?.user?._id,
        title : req?.body?.title,
        description : req?.body.description,
        plans : [
            {
                date: req?.body?.date,
                meals : req?.body?.mealsId
            }
        ] 
     }

    const creating = await SequenceMealPlanModel.create(data)
    if(!creating){
        throw new Error('faild to create saved meal plan')
    }

    res.status(status.OK).json({
        success : true,
        status : status.OK,
        messaage : 'Saved Meal Plan Created Successfully',
        data : creating
    })
     
})


export const getSequenceMealController:RequestHandler = catchAsync(async(req,res , next)=>{
     
    const finding = await SequenceMealPlanModel.find({userId:req?.user?._id}).populate('plans.meals')
    if(!finding){
        throw new Error('faild to find saved meal plan')
    }

    res.status(status.OK).json({
        success : true,
        status : status.OK,
        messaage : 'Saved Meal Retrived Successfully',
        data : finding
    })
     
})