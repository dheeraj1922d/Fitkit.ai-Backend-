import { Request, Response } from 'express';
import Meal from '../models/Meal';
import User from '../models/User';
import { sendSuccess, sendError } from '../utils/responseHandler';

/**
 * Get weekly analytics
 * GET /api/analytics/weekly
 */
export const getWeeklyAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Get last 7 days
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    startDate.setHours(0, 0, 0, 0);

    // Get all meals in the period
    const meals = await Meal.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Group by date
    const dailyStats: any[] = [];
    const dateMap = new Map<string, any>();

    // Initialize all 7 days with 0 values
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, {
        date: dateStr,
        totalCalories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      });
    }

    // Aggregate data
    meals.forEach((meal) => {
      const dateStr = meal.createdAt.toISOString().split('T')[0];
      const dayStats = dateMap.get(dateStr);

      if (dayStats) {
        dayStats.totalCalories += meal.totalCalories;
        meal.items.forEach((item) => {
          dayStats.protein += item.protein || 0;
          dayStats.carbs += item.carbs || 0;
          dayStats.fat += item.fat || 0;
        });
      }
    });

    // Convert map to array and round numbers
    dateMap.forEach((stats) => {
      dailyStats.push({
        date: stats.date,
        totalCalories: Math.round(stats.totalCalories),
        protein: Math.round(stats.protein * 10) / 10,
        carbs: Math.round(stats.carbs * 10) / 10,
        fat: Math.round(stats.fat * 10) / 10,
      });
    });

    // Sort by date
    dailyStats.sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals
    const totalCalories = dailyStats.reduce((sum, day) => sum + day.totalCalories, 0);
    const averageCalories = Math.round(totalCalories / 7);

    // Calculate macro distribution
    const totalProtein = dailyStats.reduce((sum, day) => sum + day.protein, 0);
    const totalCarbs = dailyStats.reduce((sum, day) => sum + day.carbs, 0);
    const totalFat = dailyStats.reduce((sum, day) => sum + day.fat, 0);

    const macroDistribution = {
      protein: Math.round(totalProtein / 7 * 10) / 10,
      carbs: Math.round(totalCarbs / 7 * 10) / 10,
      fat: Math.round(totalFat / 7 * 10) / 10,
    };

    sendSuccess(res, {
      dailyStats,
      averageCalories,
      totalCalories,
      macroDistribution,
    });
  } catch (error: any) {
    console.error('Get weekly analytics error:', error);
    sendError(res, error.message || 'Failed to get analytics', 500);
  }
};

/**
 * Get macro distribution
 * GET /api/analytics/macros
 */
export const getMacroDistribution = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { period = 'week' } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'month') {
      startDate.setDate(startDate.getDate() - 30);
    } else {
      startDate.setDate(startDate.getDate() - 7);
    }

    // Get meals
    const meals = await Meal.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    // Calculate totals
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;

    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        totalProtein += item.protein || 0;
        totalCarbs += item.carbs || 0;
        totalFat += item.fat || 0;
      });
    });

    // Calculate average per day
    const days = period === 'month' ? 30 : 7;
    const avgProtein = totalProtein / days;
    const avgCarbs = totalCarbs / days;
    const avgFat = totalFat / days;

    // Calculate calories from macros
    const proteinCalories = avgProtein * 4;
    const carbsCalories = avgCarbs * 4;
    const fatCalories = avgFat * 9;
    const totalCalories = proteinCalories + carbsCalories + fatCalories;

    // Calculate percentages
    const proteinPercentage = totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0;
    const carbsPercentage = totalCalories > 0 ? (carbsCalories / totalCalories) * 100 : 0;
    const fatPercentage = totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0;

    sendSuccess(res, {
      protein: {
        grams: Math.round(avgProtein * 10) / 10,
        calories: Math.round(proteinCalories),
        percentage: Math.round(proteinPercentage * 10) / 10,
      },
      carbs: {
        grams: Math.round(avgCarbs * 10) / 10,
        calories: Math.round(carbsCalories),
        percentage: Math.round(carbsPercentage * 10) / 10,
      },
      fat: {
        grams: Math.round(avgFat * 10) / 10,
        calories: Math.round(fatCalories),
        percentage: Math.round(fatPercentage * 10) / 10,
      },
    });
  } catch (error: any) {
    console.error('Get macro distribution error:', error);
    sendError(res, error.message || 'Failed to get macro distribution', 500);
  }
};

/**
 * Get AI insights
 * GET /api/analytics/insights
 */
export const getInsights = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;

    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      sendError(res, 'User not found', 404);
      return;
    }

    // Get last 7 days meals
    const endDate = new Date();
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const meals = await Meal.find({
      userId,
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    const insights: any[] = [];

    // Calculate average daily calories
    const totalCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);
    const avgDailyCalories = totalCalories / 7;

    // Insight 1: Calorie target comparison
    if (avgDailyCalories > user.dailyCalorieTarget * 1.1) {
      insights.push({
        type: 'warning',
        message: `Your average daily intake (${Math.round(avgDailyCalories)} cal) is ${Math.round((avgDailyCalories / user.dailyCalorieTarget - 1) * 100)}% above your target. Consider smaller portions.`,
        icon: '⚠️',
      });
    } else if (avgDailyCalories < user.dailyCalorieTarget * 0.9) {
      insights.push({
        type: 'info',
        message: `Your average daily intake (${Math.round(avgDailyCalories)} cal) is below your target. You might need to eat more to reach your goals.`,
        icon: '💡',
      });
    } else {
      insights.push({
        type: 'success',
        message: 'Great job! You\'re consistently meeting your calorie targets.',
        icon: '✅',
      });
    }

    // Insight 2: Meal type analysis
    const mealTypeCounts: any = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };
    const mealTypeCalories: any = { breakfast: 0, lunch: 0, dinner: 0, snack: 0 };

    meals.forEach((meal) => {
      mealTypeCounts[meal.mealType]++;
      mealTypeCalories[meal.mealType] += meal.totalCalories;
    });

    const highestMealType = Object.keys(mealTypeCalories).reduce((a, b) =>
      mealTypeCalories[a] > mealTypeCalories[b] ? a : b
    );

    if (mealTypeCalories[highestMealType] > avgDailyCalories * 0.4) {
      insights.push({
        type: 'warning',
        message: `Your ${highestMealType} calories are consistently high. Consider distributing calories more evenly throughout the day.`,
        icon: '⚠️',
      });
    }

    // Insight 3: Protein intake
    let totalProtein = 0;
    meals.forEach((meal) => {
      meal.items.forEach((item) => {
        totalProtein += item.protein || 0;
      });
    });

    const avgProtein = totalProtein / 7;
    const recommendedProtein = user.weight * 1.6; // 1.6g per kg body weight

    if (avgProtein < recommendedProtein * 0.8) {
      insights.push({
        type: 'info',
        message: `Increase protein intake by ${Math.round(recommendedProtein - avgProtein)}g to optimize muscle growth and satiety.`,
        icon: '💪',
      });
    } else if (avgProtein >= recommendedProtein) {
      insights.push({
        type: 'success',
        message: 'Great job! You\'re meeting your protein goals.',
        icon: '✅',
      });
    }

    // Calculate trends
    const firstHalfCalories = meals
      .filter((m) => m.createdAt < new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000))
      .reduce((sum, m) => sum + m.totalCalories, 0) / 3.5;

    const secondHalfCalories = meals
      .filter((m) => m.createdAt >= new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000))
      .reduce((sum, m) => sum + m.totalCalories, 0) / 3.5;

    const caloriesTrend =
      secondHalfCalories > firstHalfCalories * 1.1
        ? 'increasing'
        : secondHalfCalories < firstHalfCalories * 0.9
        ? 'decreasing'
        : 'stable';

    // Calculate goal progress
    const goalProgress = Math.min(
      Math.round((avgDailyCalories / user.dailyCalorieTarget) * 100),
      100
    );

    sendSuccess(res, {
      insights,
      trends: {
        caloriesTrend,
        proteinTrend: 'stable',
        goalProgress,
      },
    });
  } catch (error: any) {
    console.error('Get insights error:', error);
    sendError(res, error.message || 'Failed to get insights', 500);
  }
};
