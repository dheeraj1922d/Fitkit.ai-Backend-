import { Router } from 'express';
import {
  uploadMealImage,
  addMeal,
  getMealsForDay,
  getWeeklyMeals,
  deleteMeal,
  searchFood,
} from '../controllers/mealController';
import { authenticate } from '../middleware/auth';
import { mealValidation, validate } from '../middleware/validator';
import { upload } from '../config/multer';

const router = Router();

// All meal routes require authentication
router.use(authenticate);

// Upload meal image
router.post('/upload-image', upload.single('image'), uploadMealImage);

// Meal CRUD operations
router.post('/add', mealValidation, validate, addMeal);
router.get('/day/:date', getMealsForDay);
router.get('/week', getWeeklyMeals);
router.delete('/:id', deleteMeal);

// Food search
router.get('/search', searchFood);

export default router;
