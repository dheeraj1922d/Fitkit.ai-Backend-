# NutriTrack ML Service

This is the Machine Learning microservice for NutriTrack AI that handles food recognition and calorie estimation.

## Features

- Food item detection from meal images
- Portion size estimation
- Nutritional information mapping
- RESTful API interface

## Technology Stack

- **FastAPI** - Modern Python web framework
- **PyTorch** - Deep learning framework
- **Torchvision** - Computer vision models
- **Pillow** - Image processing

## Installation

### Prerequisites
- Python 3.8 or higher
- pip package manager

### Setup

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Service

### Development Mode
```bash
python app.py
```

The service will start on `http://localhost:8000`

### Production Mode
```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Endpoints

### Health Check
```
GET /health
```

Response:
```json
{
  "status": "healthy",
  "model": "mock-model (development)",
  "message": "ML service is running"
}
```

### Predict Food Items
```
POST /predict
```

Request Body:
```json
{
  "image_url": "https://example.com/meal.jpg"
}
```

Response:
```json
{
  "items": [
    {
      "name": "Rice",
      "quantity_g": 150,
      "calories": 195,
      "protein": 4.05,
      "carbs": 42.3,
      "fat": 0.45,
      "confidence": 0.90
    },
    {
      "name": "Chicken Breast",
      "quantity_g": 120,
      "calories": 198,
      "protein": 37.2,
      "carbs": 0,
      "fat": 4.32,
      "confidence": 0.85
    }
  ],
  "confidence": 0.87
}
```

## ML Model Integration

### Current Implementation
The current implementation uses mock predictions for development purposes.

### Production Implementation
For production, you should:

1. **Train a Food Classification Model**
   - Use MobileNetV3 or EfficientNet for lightweight inference
   - Train on Food-101, Food-256, or custom food dataset
   - Fine-tune for specific food categories

2. **Implement Portion Estimation**
   - Use object detection (YOLO, Faster R-CNN)
   - Estimate serving sizes based on plate/container reference
   - Apply scaling factors

3. **Nutrition Database Mapping**
   - Map detected food items to USDA nutrition database
   - Calculate nutritional values based on portion size
   - Handle multi-item meals

### Example Production Code Structure

```python
# Load pre-trained model
model = load_food_classification_model()
detector = load_object_detector()

@app.post("/predict")
async def predict_food(request: PredictionRequest):
    # Download image
    image = download_image(request.image_url)
    
    # Preprocess
    preprocessed = preprocess_image(image)
    
    # Detect food items
    detections = detector.detect(preprocessed)
    
    # Classify each detection
    predictions = []
    for detection in detections:
        food_class = model.classify(detection.crop)
        portion = estimate_portion(detection)
        nutrition = get_nutrition_from_db(food_class, portion)
        predictions.append({
            "name": food_class,
            "quantity_g": portion,
            **nutrition
        })
    
    return predictions
```

## Deployment

### Docker Deployment
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:
```bash
docker build -t nutritrack-ml .
docker run -p 8000:8000 nutritrack-ml
```

### Cloud Deployment Options

1. **AWS Lambda** - Serverless deployment with API Gateway
2. **Google Cloud Run** - Containerized deployment
3. **Azure Container Instances** - Docker containers on Azure
4. **Heroku** - Platform-as-a-service deployment
5. **Railway/Render** - Modern cloud platforms

## Performance Optimization

- Use model quantization for faster inference
- Implement caching for frequently predicted foods
- Use batch processing for multiple images
- Consider GPU acceleration for production

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test prediction endpoint
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/meal.jpg"}'
```

## License

MIT License
