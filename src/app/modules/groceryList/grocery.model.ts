import { model, Schema } from "mongoose";
import { TGrocery} from "./grocery.interface";
 




const grocerySchema = new Schema<TGrocery>({
    userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
    date: { type: Date, required: true },
    recipes: { type: [Schema.Types.ObjectId], ref:'recipes', required: true }
}, { timestamps: true })

export const groceryModel = model('groceryList', grocerySchema)