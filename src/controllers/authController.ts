import { Request, Response } from 'express';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { calculateDailyCalorieTarget } from '../utils/calculateCalories';
import {
  sendSuccess,
  sendError,
  sendUnauthorized,
  sendNotFound,
} from '../utils/responseHandler';

/**
 * Register new user
 * POST /api/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      name,
      email,
      password,
      age,
      weight,
      height,
      gender = 'male',
      activityLevel,
      goal,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(res, 'Email already exists', 400);
      return;
    }

    // Calculate daily calorie target
    const dailyCalorieTarget = calculateDailyCalorieTarget(
      weight,
      height,
      age,
      gender,
      activityLevel,
      goal
    );

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      age,
      weight,
      height,
      gender,
      activityLevel,
      dailyCalorieTarget,
      goal,
    });

    // Generate token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    // Send response
    sendSuccess(
      res,
      {
        user: user.toJSON(),
        token,
      },
      'User registered successfully',
      201
    );
  } catch (error: any) {
    console.error('Register error:', error);
    sendError(res, error.message || 'Registration failed', 500);
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendUnauthorized(res, 'Invalid email or password');
      return;
    }

    // Generate token
    const token = generateToken({
      userId: (user._id as any).toString(),
      email: user.email,
    });

    // Send response
    sendSuccess(res, {
      user: user.toJSON(),
      token,
    });
  } catch (error: any) {
    console.error('Login error:', error);
    sendError(res, error.message || 'Login failed', 500);
  }
};

/**
 * Get user profile
 * GET /api/auth/profile
 */
export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    sendSuccess(res, user.toJSON());
  } catch (error: any) {
    console.error('Get profile error:', error);
    sendError(res, error.message || 'Failed to get profile', 500);
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const updates = req.body;

    // Fields that can be updated
    const allowedUpdates = ['name', 'age', 'weight', 'height', 'activityLevel', 'goal', 'gender'];
    const requestedUpdates = Object.keys(updates);

    // Check if all updates are allowed
    const isValidOperation = requestedUpdates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      sendError(res, 'Invalid updates', 400);
      return;
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      sendNotFound(res, 'User not found');
      return;
    }

    // Apply updates
    requestedUpdates.forEach((update) => {
      (user as any)[update] = updates[update];
    });

    // Recalculate daily calorie target if relevant fields changed
    if (
      requestedUpdates.some((field) =>
        ['weight', 'height', 'age', 'activityLevel', 'goal', 'gender'].includes(field)
      )
    ) {
      user.dailyCalorieTarget = calculateDailyCalorieTarget(
        user.weight,
        user.height,
        user.age,
        user.gender || 'male',
        user.activityLevel,
        user.goal
      );
    }

    await user.save();

    sendSuccess(res, user.toJSON(), 'Profile updated successfully');
  } catch (error: any) {
    console.error('Update profile error:', error);
    sendError(res, error.message || 'Failed to update profile', 500);
  }
};
