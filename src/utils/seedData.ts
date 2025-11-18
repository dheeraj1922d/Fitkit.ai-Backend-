import FoodItem from '../models/FoodItem';

export const seedFoodDatabase = async (): Promise<void> => {
  try {
    // Check if data already exists
    const count = await FoodItem.countDocuments();
    if (count > 0) {
      console.log('Food database already seeded');
      return;
    }

    const foodItems = [
      // Proteins
      { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fat: 3.6, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Chicken Thigh', calories: 209, protein: 26, carbs: 0, fat: 10.9, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Salmon', calories: 208, protein: 20, carbs: 0, fat: 13, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Tuna', calories: 130, protein: 28, carbs: 0, fat: 1.3, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Eggs', calories: 155, protein: 13, carbs: 1.1, fat: 11, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Lean Beef', calories: 250, protein: 26, carbs: 0, fat: 15, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Pork Chop', calories: 231, protein: 25, carbs: 0, fat: 14, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Tofu', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, servingSize: 100, unit: 'g', category: 'protein' },
      { name: 'Greek Yogurt', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, servingSize: 100, unit: 'g', category: 'dairy' },
      { name: 'Cottage Cheese', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, servingSize: 100, unit: 'g', category: 'dairy' },

      // Carbs
      { name: 'White Rice', calories: 130, protein: 2.7, carbs: 28.2, fat: 0.3, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Brown Rice', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Pasta', calories: 131, protein: 5, carbs: 25, fat: 1.1, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Bread (Whole Wheat)', calories: 247, protein: 13, carbs: 41, fat: 3.4, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Oatmeal', calories: 389, protein: 16.9, carbs: 66.3, fat: 6.9, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Quinoa', calories: 120, protein: 4.4, carbs: 21.3, fat: 1.9, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Sweet Potato', calories: 86, protein: 1.6, carbs: 20.1, fat: 0.1, servingSize: 100, unit: 'g', category: 'carbs' },
      { name: 'Potato', calories: 77, protein: 2, carbs: 17, fat: 0.1, servingSize: 100, unit: 'g', category: 'carbs' },

      // Vegetables
      { name: 'Broccoli', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Spinach', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Carrot', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Tomato', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Cucumber', calories: 15, protein: 0.7, carbs: 3.6, fat: 0.1, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Bell Pepper', calories: 31, protein: 1, carbs: 6, fat: 0.3, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Lettuce', calories: 15, protein: 1.4, carbs: 2.9, fat: 0.2, servingSize: 100, unit: 'g', category: 'vegetables' },
      { name: 'Cauliflower', calories: 25, protein: 1.9, carbs: 5, fat: 0.3, servingSize: 100, unit: 'g', category: 'vegetables' },

      // Fruits
      { name: 'Apple', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Banana', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Orange', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Strawberry', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Blueberry', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Grapes', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Watermelon', calories: 30, protein: 0.6, carbs: 8, fat: 0.2, servingSize: 100, unit: 'g', category: 'fruits' },
      { name: 'Mango', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, servingSize: 100, unit: 'g', category: 'fruits' },

      // Dairy
      { name: 'Milk (Whole)', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, servingSize: 100, unit: 'ml', category: 'dairy' },
      { name: 'Milk (Skim)', calories: 34, protein: 3.4, carbs: 5, fat: 0.1, servingSize: 100, unit: 'ml', category: 'dairy' },
      { name: 'Cheese (Cheddar)', calories: 402, protein: 25, carbs: 1.3, fat: 33, servingSize: 100, unit: 'g', category: 'dairy' },
      { name: 'Mozzarella', calories: 280, protein: 28, carbs: 3.1, fat: 17, servingSize: 100, unit: 'g', category: 'dairy' },
      { name: 'Butter', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, servingSize: 100, unit: 'g', category: 'dairy' },

      // Snacks
      { name: 'Almonds', calories: 579, protein: 21, carbs: 22, fat: 50, servingSize: 100, unit: 'g', category: 'snacks' },
      { name: 'Peanuts', calories: 567, protein: 26, carbs: 16, fat: 49, servingSize: 100, unit: 'g', category: 'snacks' },
      { name: 'Walnuts', calories: 654, protein: 15, carbs: 14, fat: 65, servingSize: 100, unit: 'g', category: 'snacks' },
      { name: 'Cashews', calories: 553, protein: 18, carbs: 30, fat: 44, servingSize: 100, unit: 'g', category: 'snacks' },
      { name: 'Peanut Butter', calories: 588, protein: 25, carbs: 20, fat: 50, servingSize: 100, unit: 'g', category: 'snacks' },
      { name: 'Dark Chocolate', calories: 546, protein: 4.9, carbs: 61, fat: 31, servingSize: 100, unit: 'g', category: 'snacks' },

      // Beverages
      { name: 'Orange Juice', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, servingSize: 100, unit: 'ml', category: 'beverages' },
      { name: 'Apple Juice', calories: 46, protein: 0.1, carbs: 11, fat: 0.1, servingSize: 100, unit: 'ml', category: 'beverages' },
      { name: 'Coffee (Black)', calories: 2, protein: 0.3, carbs: 0, fat: 0, servingSize: 100, unit: 'ml', category: 'beverages' },
      { name: 'Tea (Unsweetened)', calories: 1, protein: 0, carbs: 0.3, fat: 0, servingSize: 100, unit: 'ml', category: 'beverages' },
    ];

    await FoodItem.insertMany(foodItems);
    console.log(`✅ Successfully seeded ${foodItems.length} food items to database`);
  } catch (error) {
    console.error('❌ Error seeding food database:', error);
    throw error;
  }
};
