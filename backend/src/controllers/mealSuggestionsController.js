const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const getMealSuggestions = async (req, res) => {
  try {
    const userId = req.query.userId;
    if (!userId) return res.status(400).json({ error: "User ID is required" });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    // console.log(userId);

    let foods = null;
    let calories = null;

    // Fetch foods
    try {
      const responseFoods = await fetch("http://localhost:3000/api/foods/");
      if (!responseFoods.ok)
        throw new Error(`Error fetching foods: ${responseFoods.status}`);
      foods = await responseFoods.json();
      if (!foods.length) throw new Error("No available foods.");
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch foods." });
    }

    // Fetch user calories
    try {
      const responseCalories = await fetch(
        `http://localhost:3000/api/user-calories/${userId}`
      );
      if (!responseCalories.ok)
        throw new Error(
          `Error fetching userCalories: ${responseCalories.status}`
        );
      calories = await responseCalories.json();
      if (!calories) throw new Error("User calorie data missing.");
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch user calories." });
    }

    const prompt = `You are an AI bot that recommends meals based on a user's macronutrient goals.
        Choose the best possible meal(s) from the given list of foods, even if no option perfectly matches the macros.
        For each recommendation, explain why it was chosen in relation to the user's macros.
  
        ### **Input**
        - Available foods: ${JSON.stringify(foods)}
        - User's target macros: ${JSON.stringify(calories)}
  
        ### **Output Format**
        Return the response as a **valid JSON** object in this format:
        \`\`\`json
        {
          "suggestions": [
            {
              "id": 10,
              "restaurantId": 3
              "food_name": "Steak with Veggies",
              "reason": "This meal provides high protein while keeping fats and carbs moderate, aligning well with the user's goal."
            },
            {
              "id": 19
              "restaurantId: 4
              "food_name": "Lean Beef Rice Bowl",
              "reason": "Offers a balanced mix of protein and carbs, making it a good choice for post-workout recovery."
            }
          ]
        }
        \`\`\`
  
        Do not include any additional text or explanations outside the JSON response. Only return valid JSON.`;

    const response = await model.generateContent(prompt);
    const rawText = response.response.text();
    const jsonMatch = rawText.match(/```json([\s\S]*?)```/);

    if (jsonMatch) {
      return res.json(JSON.parse(jsonMatch[1].trim()));
    } else {
      console.error("Failed to extract JSON from response:", rawText);
      return res.json({ suggestions: [] });
    }
  } catch (error) {
    console.error("Error fetching meal suggestion:", error);
    return res
      .status(500)
      .json({ error: "Error generating a meal suggestion." });
  }
};

module.exports = { getMealSuggestions };
