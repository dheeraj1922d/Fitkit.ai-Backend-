import mongoose, { Document, Schema } from 'mongoose';

export interface IFoodItem {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity_g: number;
}

export interface IMeal extends Document {
  userId: mongoose.Types.ObjectId;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  items: IFoodItem[];
  totalCalories: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const foodItemSchema = new Schema<IFoodItem>(
  {
    food: {
      type: String,
      required: [true, 'Food name is required'],
      trim: true,
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
    quantity_g: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
    },
  },
  { _id: false }
);

const mealSchema = new Schema<IMeal>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    mealType: {
      type: String,
      required: [true, 'Meal type is required'],
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    },
    items: {
      type: [foodItemSchema],
      required: [true, 'At least one food item is required'],
      validate: {
        validator: function (items: IFoodItem[]) {
          return items && items.length > 0;
        },
        message: 'Meal must have at least one food item',
      },
    },
    totalCalories: {
      type: Number,
      required: [true, 'Total calories are required'],
      min: [0, 'Total calories cannot be negative'],
    },
    imageUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient date-based queries
mealSchema.index({ userId: 1, createdAt: -1 });
mealSchema.index({ userId: 1, mealType: 1 });

const Meal = mongoose.model<IMeal>('Meal', mealSchema);

export default Meal;
