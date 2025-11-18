import { Request, Response } from 'express';
import Meal from '../models/Meal';
import FoodItem from '../models/FoodItem';
import Prediction from '../models/Prediction';
import { predictFoodFromImage } from '../services/mlService';
import {
  sendSuccess,
  sendError,
  sendNotFound,
} from '../utils/responseHandler';

/**
 * Upload meal image and get AI predictions
 * POST /api/meal/upload-image
 */
export const uploadMealImage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const file = req.file;

    if (!file) {
      sendError(res, 'No image file provided', 400);
      return;
    }

    // Create image URL (in production, this would be S3 URL)
    const imageUrl = `/uploads/${file.filename}`;

    // Get predictions from ML service
    const mlResponse = await predictFoodFromImage(imageUrl);

    // Save prediction to database
    await Prediction.create({
      userId,
      imageUrl,
      predictions: mlResponse.items,
      rawOutput: mlResponse,
      confidence: mlResponse.confidence,
    });

    // Send response
    sendSuccess(res, {
      items: mlResponse.items,
      imageUrl,
      confidence: mlResponse.confidence,
    });
  } catch (error: any) {
    console.error('Upload image error:', error);
    sendError(res, error.message || 'Failed to process image', 500);
  }
};

/**
 * Add meal entry
 * POST /api/meal/add
 */
export const addMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { mealType, items, totalCalories, imageUrl, createdAt } = req.body;

    // Create meal
    const meal = await Meal.create({
      userId,
      mealType,
      items,
      totalCalories,
      imageUrl,
      createdAt: createdAt || new Date(),
    });

    sendSuccess(res, meal.toJSON(), 'Meal added successfully', 201);
  } catch (error: any) {
    console.error('Add meal error:', error);
    sendError(res, error.message || 'Failed to add meal', 500);
  }
};

/**
 * Get meals for specific day
 * GET /api/meal/day/:date
 */
export const getMealsForDay = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { date } = req.params;

    // Parse date
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Find meals
    const meals = await Meal.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    sendSuccess(res, meals);
  } catch (error: any) {
    console.error('Get meals for day error:', error);
    sendError(res, error.message || 'Failed to get meals', 500);
  }
};

/**
 * Get weekly meals
 * GET /api/meal/week
 */
export const getWeeklyMeals = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { startDate: startDateStr, endDate: endDateStr } = req.query;

    // Default to last 7 days
    const endDate = endDateStr ? new Date(endDateStr as string) : new Date();
    const startDate = startDateStr
      ? new Date(startDateStr as string)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    endDate.setHours(23, 59, 59, 999);
    startDate.setHours(0, 0, 0, 0);

    // Find meals
    const meals = await Meal.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ createdAt: -1 });

    sendSuccess(res, meals);
  } catch (error: any) {
    console.error('Get weekly meals error:', error);
    sendError(res, error.message || 'Failed to get meals', 500);
  }
};

/**
 * Delete meal
 * DELETE /api/meal/:id
 */
export const deleteMeal = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { id } = req.params;

    const meal = await Meal.findOne({ _id: id, userId });

    if (!meal) {
      sendNotFound(res, 'Meal not found');
      return;
    }

    await meal.deleteOne();

    sendSuccess(res, null, 'Meal deleted successfully');
  } catch (error: any) {
    console.error('Delete meal error:', error);
    sendError(res, error.message || 'Failed to delete meal', 500);
  }
};

/**
 * Search food database
 * GET /api/meal/search?q=query
 */
export const searchFood = async (req: Request, res: Response): Promise<void> => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== 'string') {
      sendError(res, 'Search query is required', 400);
      return;
    }

    // Search in food database
    const foods = await FoodItem.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ],
    })
      .limit(20)
      .select('name calories protein carbs fat servingSize unit category brand');

    sendSuccess(res, foods);
  } catch (error: any) {
    console.error('Search food error:', error);
    sendError(res, error.message || 'Failed to search food', 500);
  }
};
