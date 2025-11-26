import { Request } from "express";
import { userRecipeModel } from "./userRecipe.model";




export const getUserRecipeService = async (req:Request) => {
  const recipes = await userRecipeModel.find({
        $and: [
            { userId: req.user?._id },
            { isDeleted: false }
        ]
    });

    if (!recipes || recipes.length === 0) {
        throw new Error("No recipes found for this user");
    }

    return recipes;
}


export const deleteUserRecipeService = async (req: Request) => {
     const { id } = req.query;

    if (!id) {
        throw new Error("Recipe ID is required for deletion");
    }

    const deleted = await userRecipeModel.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

    if (!deleted) {
       throw new Error('something went wrong while deleting the recipe');
    }

    return deleted;

}