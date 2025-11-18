/**
 * Calculate BMR using Mifflin-St Jeor Formula
 * BMR = 10 × weight(kg) + 6.25 × height(cm) - 5 × age + s
 * where s = +5 for males, -161 for females
 */
export const calculateBMR = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female' = 'male'
): number => {
  const baseBMR = 10 * weight + 6.25 * height - 5 * age;
  const genderAdjustment = gender === 'male' ? 5 : -161;
  return Math.round(baseBMR + genderAdjustment);
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 * TDEE = BMR × Activity Level Multiplier
 */
export const calculateTDEE = (
  bmr: number,
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
): number => {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  return Math.round(bmr * activityMultipliers[activityLevel]);
};

/**
 * Calculate daily calorie target based on goal
 */
export const calculateDailyCalorieTarget = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active',
  goal: 'loss' | 'maintain' | 'gain'
): number => {
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);

  const goalAdjustments = {
    loss: -500,
    maintain: 0,
    gain: 500,
  };

  return Math.round(tdee + goalAdjustments[goal]);
};

/**
 * Calculate BMI (Body Mass Index)
 */
export const calculateBMI = (weight: number, height: number): number => {
  // BMI = weight(kg) / (height(m))^2
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
};

/**
 * Get BMI category
 */
export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};
