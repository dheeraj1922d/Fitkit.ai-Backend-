import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface MLPredictionItem {
  name: string;
  quantity_g: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence?: number;
}

export interface MLPredictionResponse {
  items: MLPredictionItem[];
  confidence?: number;
}

/**
 * Call ML service to predict food items from image
 */
export const predictFoodFromImage = async (imageUrl: string): Promise<MLPredictionResponse> => {
  try {
    const response = await axios.post(
      `${ML_SERVICE_URL}/predict`,
      { image_url: imageUrl },
      {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error('ML Service Error:', error.message);
    
    // If ML service is unavailable, return mock data for development
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      console.warn('⚠️  ML Service unavailable, returning mock data');
      return getMockPrediction();
    }

    throw new Error('Failed to get predictions from ML service');
  }
};

/**
 * Mock prediction for development when ML service is unavailable
 */
const getMockPrediction = (): MLPredictionResponse => {
  return {
    items: [
      {
        name: 'Rice',
        quantity_g: 150,
        calories: 195,
        protein: 4.2,
        carbs: 42.6,
        fat: 0.4,
        confidence: 0.85,
      },
      {
        name: 'Chicken Breast',
        quantity_g: 120,
        calories: 198,
        protein: 37.2,
        carbs: 0,
        fat: 4.3,
        confidence: 0.90,
      },
      {
        name: 'Broccoli',
        quantity_g: 80,
        calories: 27,
        protein: 2.3,
        carbs: 5.5,
        fat: 0.3,
        confidence: 0.75,
      },
    ],
    confidence: 0.83,
  };
};

export default {
  predictFoodFromImage,
};
