import { Router } from 'express';
import {
  getWeeklyAnalytics,
  getMacroDistribution,
  getInsights,
} from '../controllers/analyticsController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All analytics routes require authentication
router.use(authenticate);

router.get('/weekly', getWeeklyAnalytics);
router.get('/macros', getMacroDistribution);
router.get('/insights', getInsights);

export default router;
