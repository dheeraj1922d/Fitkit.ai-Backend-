# NutriTrack AI - Deployment Guide

This guide covers multiple deployment options for the NutriTrack AI backend and ML service.

## 📋 Prerequisites

- MongoDB Atlas account (or MongoDB instance)
- AWS S3 bucket (optional, for production image storage)
- Deployment platform account (Render, Railway, Heroku, or AWS)

## 🚀 Deployment Options

### Option 1: Render.com (Recommended - Free Tier Available)

#### Step 1: Prepare MongoDB Atlas

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a free M0 cluster
3. Create database user
4. Get connection string
5. Whitelist all IPs (0.0.0.0/0) for Render

#### Step 2: Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Click "New +" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml`
6. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a secure random string
   - `AWS_ACCESS_KEY_ID`: (if using S3)
   - `AWS_SECRET_ACCESS_KEY`: (if using S3)
7. Click "Apply"
8. Wait for deployment (5-10 minutes)

Your services will be available at:
- Backend: `https://your-service-name.onrender.com`
- ML Service: `https://your-ml-service.onrender.com`

### Option 2: Railway.app

#### Step 1: Install Railway CLI
```bash
npm install -g @railway/cli
```

#### Step 2: Login and Initialize
```bash
railway login
cd backend
railway init
```

#### Step 3: Add MongoDB Plugin
```bash
railway add mongodb
```

#### Step 4: Set Environment Variables
```bash
railway variables set NODE_ENV=production
railway variables set JWT_SECRET=your_secret_here
railway variables set PORT=5000
```

#### Step 5: Deploy
```bash
railway up
```

Get your service URL:
```bash
railway domain
```

### Option 3: Docker Compose (Self-Hosted)

#### Step 1: Install Docker
- Docker: https://docs.docker.com/get-docker/
- Docker Compose: https://docs.docker.com/compose/install/

#### Step 2: Configure Environment
Edit `docker-compose.yml` and update:
- MongoDB credentials
- JWT_SECRET
- Other environment variables

#### Step 3: Start Services
```bash
cd backend
docker-compose up -d
```

Services will be available at:
- Backend API: http://localhost:5000
- ML Service: http://localhost:8000
- MongoDB: localhost:27017

#### Step 4: View Logs
```bash
docker-compose logs -f
```

#### Step 5: Stop Services
```bash
docker-compose down
```

### Option 4: AWS Elastic Beanstalk

#### Step 1: Install EB CLI
```bash
pip install awsebcli
```

#### Step 2: Initialize
```bash
cd backend
eb init -p node.js-18 nutritrack-backend
```

#### Step 3: Create Environment
```bash
eb create nutritrack-prod
```

#### Step 4: Set Environment Variables
```bash
eb setenv NODE_ENV=production MONGODB_URI=your_uri JWT_SECRET=your_secret
```

#### Step 5: Deploy
```bash
eb deploy
```

### Option 5: Heroku

#### Step 1: Install Heroku CLI
```bash
npm install -g heroku
```

#### Step 2: Login and Create App
```bash
heroku login
cd backend
heroku create nutritrack-backend
```

#### Step 3: Add MongoDB
```bash
heroku addons:create mongodb:sandbox
```

#### Step 4: Set Environment Variables
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set ML_SERVICE_URL=your_ml_service_url
```

#### Step 5: Deploy
```bash
git push heroku main
```

## 🗄️ MongoDB Setup

### Option 1: MongoDB Atlas (Recommended)

1. Create account at https://www.mongodb.com/cloud/atlas
2. Create M0 Free Cluster
3. Create database user
4. Whitelist IP: 0.0.0.0/0 (allow all)
5. Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/nutritrack?retryWrites=true&w=majority
   ```

### Option 2: Local MongoDB

Install MongoDB:
```bash
# macOS
brew install mongodb-community

# Ubuntu
sudo apt install mongodb

# Start service
sudo systemctl start mongodb
```

Connection string: `mongodb://localhost:27017/nutritrack`

## 🤖 ML Service Deployment

### Render.com
ML service is automatically deployed with backend using `render.yaml`

### Separate Deployment
If deploying ML service separately:

```bash
cd ml-service

# Create Dockerfile (already exists)
# Push to GitHub

# On Render:
# 1. New Web Service
# 2. Connect repository
# 3. Root directory: ml-service
# 4. Build command: pip install -r requirements.txt
# 5. Start command: uvicorn app:app --host 0.0.0.0 --port $PORT
```

### Google Cloud Run
```bash
gcloud run deploy nutritrack-ml \
  --source ml-service/ \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### AWS Lambda
Create Lambda function with API Gateway:
```python
# Use Mangum adapter for FastAPI
from mangum import Mangum
from app import app

handler = Mangum(app)
```

## 📦 Environment Variables

### Required Variables

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/nutritrack

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRE=7d

# ML Service
ML_SERVICE_URL=https://your-ml-service.onrender.com

# CORS
FRONTEND_URL=https://your-frontend-domain.com
```

### Optional Variables (AWS S3)

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=nutritrack-meals
AWS_REGION=us-east-1
```

## 🧪 Testing Deployment

### Health Check
```bash
curl https://your-backend-url.com/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "NutriTrack API is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### Test Authentication
```bash
# Register user
curl -X POST https://your-backend-url.com/api/auth/register \
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

# Login
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Test ML Service
```bash
curl https://your-ml-service.com/health
```

## 🔒 Security Checklist

- [ ] Change default JWT_SECRET to secure random string
- [ ] Use HTTPS for all API endpoints
- [ ] Configure CORS to allow only your frontend domain
- [ ] Set up MongoDB user with limited permissions
- [ ] Enable MongoDB Atlas IP whitelist (production)
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (already configured)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for database
- [ ] Use AWS IAM roles instead of access keys (if using S3)

## 📊 Monitoring

### Render.com
- Built-in metrics dashboard
- View logs in real-time
- Set up health check alerts

### Railway
- Resource usage monitoring
- Real-time logs
- Deployment history

### Custom Monitoring
Set up external monitoring:
- **UptimeRobot**: Free uptime monitoring
- **LogRocket**: Error tracking
- **Sentry**: Error monitoring
- **DataDog**: Full-stack monitoring

## 🔄 Continuous Deployment

### GitHub Actions (CI/CD)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Render

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
```

### Auto-deploy on Push
Most platforms support auto-deploy:
- **Render**: Enable auto-deploy in settings
- **Railway**: Automatically enabled
- **Heroku**: Enable GitHub integration

## 🐛 Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Check MongoDB URI, whitelist IP, verify credentials

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT environment variable or kill process

#### 3. ML Service Timeout
```
Error: Failed to get predictions from ML service
```
**Solution**: Verify ML_SERVICE_URL, check ML service logs

#### 4. CORS Error
```
Access to fetch blocked by CORS policy
```
**Solution**: Update FRONTEND_URL in environment variables

### View Logs

**Render**:
```bash
# View in dashboard or use CLI
render logs
```

**Railway**:
```bash
railway logs
```

**Docker**:
```bash
docker-compose logs -f backend
docker-compose logs -f ml-service
```

## 📈 Scaling

### Vertical Scaling (Render/Railway)
1. Upgrade plan to larger instance
2. Increase memory and CPU
3. No code changes required

### Horizontal Scaling
1. Enable multiple instances
2. Add load balancer
3. Use Redis for session storage
4. Configure sticky sessions

### Database Scaling
1. Upgrade MongoDB Atlas tier
2. Enable sharding
3. Add read replicas
4. Implement caching layer

## 💰 Cost Optimization

### Free Tier Options
- **Render**: Free tier with 750 hours/month
- **Railway**: $5 credit/month
- **MongoDB Atlas**: Free M0 cluster
- **Heroku**: Free tier (limited)

### Production Recommendations
- **Backend**: Render Starter ($7/month)
- **ML Service**: Render Starter ($7/month)
- **Database**: MongoDB Atlas M2 ($9/month)
- **Total**: ~$23/month

## 📞 Support

For deployment issues:
- Check logs first
- Review environment variables
- Test locally with production settings
- Contact platform support
- Open GitHub issue

---

**Deployment checklist complete! 🚀**
