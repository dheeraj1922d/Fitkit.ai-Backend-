import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { sendValidationError } from '../utils/responseHandler';

/**
 * Validation result handler
 */
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors: any = {};
    errors.array().forEach((error: any) => {
      formattedErrors[error.path] = error.msg;
    });
    sendValidationError(res, formattedErrors);
    return;
  }
  
  next();
};

/**
 * User registration validation rules
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 13, max: 120 }).withMessage('Age must be between 13 and 120'),
  
  body('weight')
    .notEmpty().withMessage('Weight is required')
    .isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg'),
  
  body('height')
    .notEmpty().withMessage('Height is required')
    .isFloat({ min: 100, max: 250 }).withMessage('Height must be between 100 and 250 cm'),
  
  body('activityLevel')
    .notEmpty().withMessage('Activity level is required')
    .isIn(['sedentary', 'light', 'moderate', 'active', 'very_active'])
    .withMessage('Invalid activity level'),
  
  body('goal')
    .notEmpty().withMessage('Goal is required')
    .isIn(['loss', 'maintain', 'gain'])
    .withMessage('Invalid goal'),
  
  body('gender')
    .optional()
    .isIn(['male', 'female'])
    .withMessage('Invalid gender'),
];

/**
 * User login validation rules
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
];

/**
 * Meal creation validation rules
 */
export const mealValidation = [
  body('mealType')
    .notEmpty().withMessage('Meal type is required')
    .isIn(['breakfast', 'lunch', 'dinner', 'snack'])
    .withMessage('Invalid meal type'),
  
  body('items')
    .isArray({ min: 1 }).withMessage('At least one food item is required'),
  
  body('items.*.food')
    .notEmpty().withMessage('Food name is required'),
  
  body('items.*.calories')
    .isFloat({ min: 0 }).withMessage('Calories must be a positive number'),
  
  body('items.*.quantity_g')
    .isFloat({ min: 0 }).withMessage('Quantity must be a positive number'),
  
  body('totalCalories')
    .isFloat({ min: 0 }).withMessage('Total calories must be a positive number'),
];
