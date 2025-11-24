import mongoose, { Schema, Document, Types } from 'mongoose';
import { Recipe, RecipeIngredient, Tinstruction, Treview } from './recipe.inteface';



// RecipeIngredient Schema
export const RecipeIngredientSchema: Schema = new Schema<RecipeIngredient>({
    name: {
        type: String,
        required: [true, 'Ingredient name is required'],
        minlength: [3, 'Ingredient name should be at least 3 characters long']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['g', 'kg', 'ml', 'l', 'cup', 'tsp', 'tbsp', 'oz', 'lb', 'kcal', 'pcs','cloves'], 
        message: '{VALUE} is not a valid unit'
    },
    value: {
        type: String,
        required: [true, 'Value is required'],
        match: [/^\d+(\.\d+)?$/, 'Value must be a valid number'] // regex for numeric values
    },
    category : { type: String, required: [true, 'Category is required'], }
});

// RecipeTime Schema
const RecipeTimeSchema: Schema = new Schema({
    totalTime: {
        type: String,
        required: [true, 'Total time is required'],
        match: [/^\d+$/, 'Total time must be a valid number in minutes'] // ensuring it's a numeric value
    },
    prepTime: {
        type: String,
        required: [true, 'Preparation time is required'],
        match: [/^\d+$/, 'Preparation time must be a valid number in minutes']
    },
    cookTime: {
        type: String,
        required: [true, 'Cook time is required'],
        match: [/^\d+$/, 'Cook time must be a valid number in minutes']
    }
});

// Review Schema
const ReviewSchema: Schema = new Schema<Treview>({
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: [1, 'Rating must be between 1 and 5'],
        max: [5, 'Rating must be between 1 and 5']
    },
    review: {
        type: String,
        required: [true, 'Review text is required'],
        default: '',    
        minlength: [10, 'Review should be at least 10 characters long']
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: [true, 'User ID is required']
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

// Note Schema
const NoteSchema: Schema = new Schema({
    note: {
        type: String,
        required: [true, 'Note text is required'],
        minlength: [5, 'Note should be at least 5 characters long']
    },
    userId: {
        type: String,
        required: [true, 'User ID is required']
    }
});

const instructionSchema = new Schema<Tinstruction>({
    title : {type:String, required: [true, 'instruction Title is required']},
    videoUrl : {type:String, required: [true, 'instruction video is required']}
})


// NutritionValue Schema
const NutritionValueSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Nutrition name is required']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required']
    },
    value: {
        type: String,
        required: [true, 'Value is required'],
        match: [/^\d+(\.\d+)?$/, 'Value must be a valid number'] // regex for numeric values
    }
});


// Recipe Schema (Main schema)
const RecipeSchema: Schema = new Schema<Recipe>({
    title: {
        type: String,
        required: [true, 'Recipe title is required'],
        minlength: [3, 'Title should be at least 3 characters long']
    },
    description: {
        type: String,
        required: [true, 'Recipe description is required'],
        minlength: [10, 'Description should be at least 10 characters long']
    },
    images: {
        type: [String],
        required: [true, 'Images are required'],
        validate: {
            validator: function (value: string[]) {
                return value.every(url => /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i.test(url));
            },
            message: 'All image URLs must be valid'
        }
    },
    allergens: {
        type: [String],
        required: [true, 'Allergens are required']
    },
    tags: {
        type: [String],
        required: [true, 'Tags are required']
    },
    serving: {
        type: Number,
        required: [true, 'Serving size is required'],
        min: [1, 'Serving size must be at least 1']
    },

    ingredients: {
        type: [RecipeIngredientSchema],
        required: [true, 'Ingredients are required'],
        validate: {
            validator: function (value: any[]) {
                return value.length > 0;
            },
            message: 'At least one ingredient is required'
        }
    },

    nutritionValue: {
        type: [NutritionValueSchema],
        required: [true, 'Nutrition values are required'],
        validate: {
            validator: function (value: any[]) {
                return value.length > 0;
            },
            message: 'At least one value is required'
        }
    },
    required_skill: { type: [String], required: true },
    instruction: {
        type: [instructionSchema],
        required: [true, 'Instructions are required'],
        minlength: [3, 'Each instruction should be at least 3 characters long']
    },
    time: {
        type: RecipeTimeSchema,
        required: [true, 'Time information is required']
    },
    reviews: {
        type: [ReviewSchema],
        default: []
    },
    notes: {
        type: [NoteSchema],
        default: []
    },
    isDeleted: { type: Boolean, default: false }
}, { timestamps: true, strict: 'throw' });


const recipeModel = mongoose.model<Recipe>('recipes', RecipeSchema);


export { recipeModel };
