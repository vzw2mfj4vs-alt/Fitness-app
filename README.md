# Fitness App

A comprehensive fitness tracking application with heart rate monitoring, meal planning, and workout tracking.

## Features

### 🏃 Heart Rate Monitoring
- Log heart rate readings with activity type
- Track heart rate history over time
- View detailed statistics (average, max, min, median)
- Analyze heart rate by activity type
- Set target heart rate zones based on fitness goals

### 🍽️ Meal Planning
- Create and manage custom meals
- Track nutritional information (calories, protein, carbs, fats, fiber)
- View daily meal summaries with nutritional totals
- Plan meals for multiple days
- Support for meal types: breakfast, lunch, dinner, snacks
- Track meal preparation and cooking times

### 💪 Workout Tracking
- Log workouts with detailed information
- Support for multiple workout types: cardio, strength, flexibility, sports
- Track workout duration, calories burned, and intensity
- Log individual exercises with sets, reps, and weights
- Monitor workout statistics and progress
- Track mood and environmental conditions during workouts
- Integrate heart rate data with workouts

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs for password hashing
- **Validation**: express-validator

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/vzw2mfj4vs-alt/Fitness-app.git
cd Fitness-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Update the `.env` file with your MongoDB URI and JWT secret:
```
MONGODB_URI=mongodb://localhost:27017/fitness-app
PORT=5000
JWT_SECRET=your_secure_jwt_secret_key
NODE_ENV=development
REACT_APP_API_URL=http://localhost:5000/api
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the server:
```bash
npm run dev
```

The server will be running on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### User Profile
- `GET /api/users/profile` - Get user profile (requires auth)
- `PUT /api/users/profile` - Update user profile (requires auth)

### Heart Rate
- `POST /api/heart-rate/log` - Log a heart rate reading
- `GET /api/heart-rate/history` - Get heart rate history
- `GET /api/heart-rate/stats` - Get heart rate statistics

### Meals
- `POST /api/meals` - Create a new meal
- `GET /api/meals` - Get all meals
- `GET /api/meals/date/:date` - Get meals for a specific date
- `PUT /api/meals/:id` - Update a meal
- `DELETE /api/meals/:id` - Delete a meal

### Workouts
- `POST /api/workouts` - Log a new workout
- `GET /api/workouts` - Get all workouts
- `GET /api/workouts/stats` - Get workout statistics
- `GET /api/workouts/:id` - Get a specific workout
- `PUT /api/workouts/:id` - Update a workout
- `DELETE /api/workouts/:id` - Delete a workout

## Example Requests

### Register
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }'
```

### Log Heart Rate
```bash
curl -X POST http://localhost:5000/api/heart-rate/log \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "bpm": 75,
    "activity": "rest",
    "notes": "Morning reading"
  }'
```

### Create a Meal
```bash
curl -X POST http://localhost:5000/api/meals \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Grilled Chicken Salad",
    "calories": 350,
    "protein": 35,
    "carbs": 20,
    "fats": 12,
    "mealType": "lunch",
    "ingredients": ["chicken", "lettuce", "tomato", "olive oil"]
  }'
```

### Log a Workout
```bash
curl -X POST http://localhost:5000/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Morning Run",
    "type": "cardio",
    "duration": 30,
    "caloriesBurned": 300,
    "intensity": "moderate",
    "averageHeartRate": 140
  }'
```

## Database Models

### User
- Name, Email, Password
- Age, Weight, Height, Gender
- Fitness Goal (weight-loss, muscle-gain, endurance, general-fitness)
- Target Heart Rate Range

### HeartRate
- BPM (beats per minute)
- Activity Type
- Timestamp
- Notes

### Meal
- Name, Description
- Calories and Macro Nutrients (Protein, Carbs, Fats, Fiber)
- Meal Type (breakfast, lunch, dinner, snack)
- Ingredients, Preparation/Cooking Time
- Servings, Instructions

### Workout
- Name, Description
- Type (cardio, strength, flexibility, sports, other)
- Duration, Calories Burned, Intensity
- Exercises (with sets, reps, weight/distance)
- Location, Weather, Mood
- Heart Rate Data (average, max, min)

### MealPlan
- Name, Description, Duration
- Start and End Date
- Target Nutrition Goals
- Daily Meal Assignments

## Future Features

- [ ] React frontend with dashboard
- [ ] Mobile app (React Native)
- [ ] Integration with wearable devices
- [ ] Advanced analytics and progress tracking
- [ ] Social features (share progress, challenges)
- [ ] Workout recommendations based on fitness level
- [ ] AI-powered meal planning
- [ ] Push notifications for reminders
- [ ] Export data to PDF/CSV

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For support, email support@fitnessapp.com or open an issue on GitHub.
