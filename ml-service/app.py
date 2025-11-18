"""
NutriTrack AI - ML Service for Food Recognition
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import uvicorn
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="NutriTrack ML Service",
    description="AI-powered food recognition and calorie estimation",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class PredictionRequest(BaseModel):
    image_url: str

class FoodItem(BaseModel):
    name: str
    quantity_g: float
    calories: float
    protein: float
    carbs: float
    fat: float
    confidence: Optional[float] = 0.85

class PredictionResponse(BaseModel):
    items: List[FoodItem]
    confidence: Optional[float] = 0.85

# Food nutrition database (simplified)
NUTRITION_DB = {
    "rice": {"calories": 130, "protein": 2.7, "carbs": 28.2, "fat": 0.3},
    "chicken breast": {"calories": 165, "protein": 31, "carbs": 0, "fat": 3.6},
    "broccoli": {"calories": 34, "protein": 2.8, "carbs": 7, "fat": 0.4},
    "salmon": {"calories": 208, "protein": 20, "carbs": 0, "fat": 13},
    "eggs": {"calories": 155, "protein": 13, "carbs": 1.1, "fat": 11},
    "pasta": {"calories": 131, "protein": 5, "carbs": 25, "fat": 1.1},
    "bread": {"calories": 247, "protein": 13, "carbs": 41, "fat": 3.4},
    "banana": {"calories": 89, "protein": 1.1, "carbs": 23, "fat": 0.3},
    "apple": {"calories": 52, "protein": 0.3, "carbs": 14, "fat": 0.2},
    "potato": {"calories": 77, "protein": 2, "carbs": 17, "fat": 0.1},
    "salad": {"calories": 15, "protein": 1.4, "carbs": 2.9, "fat": 0.2},
    "steak": {"calories": 250, "protein": 26, "carbs": 0, "fat": 15},
}

def get_nutrition_info(food_name: str, quantity_g: float):
    """Get nutrition information for a food item"""
    food_lower = food_name.lower()
    
    # Find matching food in database
    nutrition = NUTRITION_DB.get(food_lower, {
        "calories": 100,
        "protein": 5,
        "carbs": 15,
        "fat": 3
    })
    
    # Scale to quantity (database values are per 100g)
    scale = quantity_g / 100
    
    return {
        "calories": round(nutrition["calories"] * scale, 1),
        "protein": round(nutrition["protein"] * scale, 1),
        "carbs": round(nutrition["carbs"] * scale, 1),
        "fat": round(nutrition["fat"] * scale, 1),
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "NutriTrack ML Service",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "predict": "/predict",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "model": "mock-model (development)",
        "message": "ML service is running"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_food(request: PredictionRequest):
    """
    Predict food items from image
    
    In production, this would:
    1. Download image from URL
    2. Preprocess image
    3. Run through ML model (MobileNet/EfficientNet)
    4. Estimate portions
    5. Map to nutrition database
    
    For development, returns mock predictions
    """
    try:
        logger.info(f"Received prediction request for image: {request.image_url}")
        
        # Mock predictions (in production, this would use actual ML model)
        mock_predictions = [
            {
                "name": "Rice",
                "quantity_g": 150,
                **get_nutrition_info("rice", 150),
                "confidence": 0.90
            },
            {
                "name": "Chicken Breast",
                "quantity_g": 120,
                **get_nutrition_info("chicken breast", 120),
                "confidence": 0.85
            },
            {
                "name": "Broccoli",
                "quantity_g": 80,
                **get_nutrition_info("broccoli", 80),
                "confidence": 0.78
            }
        ]
        
        # Calculate overall confidence
        avg_confidence = sum(item["confidence"] for item in mock_predictions) / len(mock_predictions)
        
        return PredictionResponse(
            items=[FoodItem(**item) for item in mock_predictions],
            confidence=round(avg_confidence, 2)
        )
        
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
