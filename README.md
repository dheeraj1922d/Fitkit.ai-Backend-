# NutriTrack AI - Backend API

Backend API server for NutriTrack AI, an AI-powered calorie tracking application built with Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

### Core Functionality
- ✅ User authentication (JWT-based)
- ✅ Meal tracking and management
- ✅ AI-powered food recognition
- ✅ Daily calorie tracking
- ✅ Weekly analytics and insights
- ✅ Macro nutrient distribution
- ✅ Food database with search
- ✅ Image upload handling

### Technical Features
- TypeScript for type safety
- MongoDB with Mongoose ODM
- JWT authentication
- File upload with Multer
- Input validation
- Error handling middleware
- Rate limiting
- CORS support
- Security headers (Helmet)
- Request logging (Morgan)

## 📋 Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Python 3.8+ (for ML service)

## 🛠 Installation

### 1. Clone and Navigate
```bash
cd backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/nutritrack
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nutritrack

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# AWS S3 (optional for development)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=nutritrack-meals
AWS_REGION=us-east-1

# ML Service
ML_SERVICE_URL=http://localhost:8000

# CORS
FRONTEND_URL=http://localhost:3000
```

### 4. Install MongoDB (if using local)

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu/Debian:**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
- Download from https://www.mongodb.com/try/download/community
- Install and run MongoDB as a service

### 5. Seed Database
```bash
npm run seed
```

This will populate the food database with common food items.

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000` with auto-reload on file changes.

### Production Mode
```bash
npm run build
npm start
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.ts       # MongoDB connection
│   │   └── multer.ts         # File upload configuration
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── mealController.ts    # Meal management
│   │   └── analyticsController.ts # Analytics & insights
│   ├── middleware/
│   │   ├── auth.ts           # JWT authentication
│   │   ├── errorHandler.ts  # Error handling
│   │   └── validator.ts     # Input validation
│   ├── models/
│   │   ├── User.ts           # User model
│   │   ├── Meal.ts           # Meal model
│   │   ├── FoodItem.ts       # Food database model
│   │   └── Prediction.ts    # ML predictions model
│   ├── routes/
│   │   ├── authRoutes.ts    # Auth endpoints
│   │   ├── mealRoutes.ts    # Meal endpoints
│   │   ├── analyticsRoutes.ts # Analytics endpoints
│   │   └── index.ts         # Route aggregator
│   ├── services/
│   │   └── mlService.ts     # ML service integration
│   ├── utils/
│   │   ├── calculateCalories.ts # Calorie calculations
│   │   ├── jwt.ts           # JWT utilities
│   │   ├── responseHandler.ts # API response helpers
│   │   └── seedData.ts      # Database seed data
│   ├── scripts/
│   │   └── seed.ts          # Seed script
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
├── ml-service/              # Python ML service
│   ├── app.py               # FastAPI ML service
│   ├── requirements.txt     # Python dependencies
│   └── README.md
├── uploads/                 # Uploaded images (local dev)
├── .env                     # Environment variables
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 28,
  "weight": 75,
  "height": 175,
  "activityLevel": "moderate",
  "goal": "loss",
  "gender": "male"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "weight": 74,
  "goal": "maintain"
}
```

### Meals

#### Upload Meal Image
```http
POST /api/meal/upload-image
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

image: <file>
```

#### Add Meal
```http
POST /api/meal/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "mealType": "lunch",
  "items": [
    {
      "food": "Chicken Breast",
      "quantity_g": 150,
      "calories": 248,
      "protein": 46.5,
      "carbs": 0,
      "fat": 5.4
    }
  ],
  "totalCalories": 248,
  "imageUrl": "/uploads/meal-123.jpg"
}
```

#### Get Meals for Day
```http
GET /api/meal/day/2024-01-15
Authorization: Bearer <jwt_token>
```

#### Get Weekly Meals
```http
GET /api/meal/week?startDate=2024-01-08&endDate=2024-01-15
Authorization: Bearer <jwt_token>
```

#### Delete Meal
```http
DELETE /api/meal/:id
Authorization: Bearer <jwt_token>
```

#### Search Food
```http
GET /api/meal/search?q=chicken
Authorization: Bearer <jwt_token>
```

### Analytics

#### Get Weekly Analytics
```http
GET /api/analytics/weekly
Authorization: Bearer <jwt_token>
```

#### Get Macro Distribution
```http
GET /api/analytics/macros?period=week
Authorization: Bearer <jwt_token>
```

#### Get AI Insights
```http
GET /api/analytics/insights
Authorization: Bearer <jwt_token>
```

## 🤖 ML Service

### Starting ML Service

1. Navigate to ML service directory:
```bash
cd ml-service
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the service:
```bash
python app.py
```

The ML service will start on `http://localhost:8000`

### ML Service Endpoints

#### Health Check
```http
GET http://localhost:8000/health
```

#### Predict Food
```http
POST http://localhost:8000/predict
Content-Type: application/json

{
  "image_url": "http://localhost:5000/uploads/meal-123.jpg"
}
```

## 📊 Database Models

### User Schema
```typescript
{
  name: string
  email: string (unique)
  password: string (hashed)
  age: number (13-120)
  weight: number (30-300 kg)
  height: number (100-250 cm)
  gender: 'male' | 'female'
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  dailyCalorieTarget: number (calculated)
  goal: 'loss' | 'maintain' | 'gain'
  createdAt: Date
  updatedAt: Date
}
```

### Meal Schema
```typescript
{
  userId: ObjectId (ref: User)
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  items: [{
    food: string
    calories: number
    protein: number
    carbs: number
    fat: number
    quantity_g: number
  }]
  totalCalories: number
  imageUrl: string
  createdAt: Date
}
```

## 🧮 Calorie Calculation

The app uses the **Mifflin-St Jeor Formula**:

### BMR (Basal Metabolic Rate)
- **Male**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + 5
- **Female**: BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age - 161

### TDEE (Total Daily Energy Expenditure)
TDEE = BMR × Activity Multiplier

Activity Multipliers:
- Sedentary: 1.2
- Light: 1.375
- Moderate: 1.55
- Active: 1.725
- Very Active: 1.9

### Goal Adjustment
- Weight Loss: TDEE - 500 calories
- Maintain: TDEE
- Weight Gain: TDEE + 500 calories

## 🧪 Testing

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "age": 25,
    "weight": 70,
    "height": 170,
    "activityLevel": "moderate",
    "goal": "loss",
    "gender": "male"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get Today's Meals:**
```bash
curl -X GET http://localhost:5000/api/meal/day/2024-01-15 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
Import the API collection and test all endpoints easily.

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Push code to GitHub**

2. **Create new web service on Render/Railway**

3. **Configure environment variables**:
   - NODE_ENV=production
   - MONGODB_URI=<your_mongodb_atlas_uri>
   - JWT_SECRET=<secure_random_string>
   - All other environment variables

4. **Build command**: `npm run build`

5. **Start command**: `npm start`

### ML Service Deployment

#### Option 1: Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY ml-service/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY ml-service/ .
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Option 2: Cloud Run (Google Cloud)
```bash
gcloud run deploy nutritrack-ml \
  --source ml-service/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation
- Rate limiting
- CORS configuration
- Helmet security headers
- Environment variable protection

## 📝 Scripts

```json
{
  "dev": "nodemon --exec ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js",
  "seed": "ts-node src/scripts/seed.ts"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License

## 👥 Authors

- Backend Development Team
- ML Engineering Team

## 🐛 Issues & Support

For issues and questions, create an issue on GitHub or contact support.

---

**Built with ❤️ using Node.js, Express, MongoDB, and TypeScript**
