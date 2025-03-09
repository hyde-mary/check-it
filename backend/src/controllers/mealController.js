const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const getMeal = async (req, res) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    let foods = null;
    let calories = null;

    try {
      const responseFoods = await fetch("http://localhost:3000/foods/");
      if (!responseFoods.ok) {
        throw new Error(
          `Error fetching foods! Status: ${responseFoods.status}`
        );
      }
      foods = await responseFoods.json();

      const responseCalories = await fetch(
        "http://localhost:3000/calories/userCalories",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: req.body.userId }),
        }
      );

      if (!responseCalories.ok) {
        throw new Error(
          `Error fetching userCalories! Status: ${responseCalories.status}`
        );
      }
      calories = await responseCalories.json();

      if (!foods || foods.length === 0) {
        throw new Error(`Foods data is empty.`);
      }
      if (!calories) {
        throw new Error(`User calorie data is missing.`);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      return res
        .status(500)
        .json({ error: "Meal suggestion service unavailable." });
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
              "food_name": "Steak with Veggies",
              "reason": "This meal provides high protein while keeping fats and carbs moderate, aligning well with the user's goal."
            },
            {
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

module.exports = { getMeal };
