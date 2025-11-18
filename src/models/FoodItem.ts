import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodItemDB extends Document {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: number;
  unit: string;
  category?: string;
  brand?: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodItemSchema = new Schema<IFoodItemDB>(
  {
    name: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
      index: true,
    },
    calories: {
      type: Number,
      required: [true, 'Calories are required'],
      min: [0, 'Calories cannot be negative'],
    },
    protein: {
      type: Number,
      required: [true, 'Protein is required'],
      min: [0, 'Protein cannot be negative'],
      default: 0,
    },
    carbs: {
      type: Number,
      required: [true, 'Carbs are required'],
      min: [0, 'Carbs cannot be negative'],
      default: 0,
    },
    fat: {
      type: Number,
      required: [true, 'Fat is required'],
      min: [0, 'Fat cannot be negative'],
      default: 0,
    },
    servingSize: {
      type: Number,
      required: [true, 'Serving size is required'],
      min: [0, 'Serving size cannot be negative'],
      default: 100,
    },
    unit: {
      type: String,
      required: true,
      default: 'g',
      enum: ['g', 'ml', 'oz', 'cup', 'piece'],
    },
    category: {
      type: String,
      trim: true,
      enum: ['protein', 'carbs', 'vegetables', 'fruits', 'dairy', 'snacks', 'beverages', 'other'],
      default: 'other',
    },
    brand: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for food search
foodItemSchema.index({ name: 'text', brand: 'text' });

const FoodItem = mongoose.model<IFoodItemDB>('FoodItem', foodItemSchema);

export default FoodItem;
