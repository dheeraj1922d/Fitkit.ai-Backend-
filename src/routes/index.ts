import { Router } from 'express';
import authRoutes from './authRoutes';
import mealRoutes from './mealRoutes';
import analyticsRoutes from './analyticsRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/meal', mealRoutes);
router.use('/analytics', analyticsRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'NutriTrack API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
