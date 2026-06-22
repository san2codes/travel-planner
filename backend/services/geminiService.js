const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateTripPlan = async (
  destination,
  durationDays,
  budgetTier,
  interests,
  travelMonth,
) => {
  const prompt = `
Generate a travel itinerary.

Destination: ${destination}
Duration: ${durationDays}
Budget: ${budgetTier}
Travel Month: ${travelMonth}
Interests: ${interests.join(", ")}

IMPORTANT:

The packing list must be based on the expected weather and season
for the destination during the selected travel month.

Examples:

Tokyo + December:
Winter jacket
Gloves
Thermals

Dubai + July:
Sunglasses
Light cotton clothing
Sunblock

Paris + October:
Light jacket
Umbrella

Avoid generic packing lists.
Make the packing recommendations season-aware.

Return ONLY valid JSON.

No markdown.
No explanation.
No backticks.

Use EXACTLY this structure:

{
  "itinerary":[
    {
      "dayNumber":1,
      "activities":[
        {
          "title":"Visit Temple",
          "description":"Explore ancient temple",
          "estimatedCost":20,
          "timeOfDay":"Morning"
        }
      ]
    }
  ],

  "hotels":[
    {
      "name":"Hotel Name",
      "tier":"Medium",
      "estimatedCostPerNight":100,
      "rating":"4.5"
    }
  ],

  "estimatedBudget":{
    "transport":100,
    "accommodation":500,
    "food":200,
    "activities":150,
    "total":950
  },

  "packingList":[
    {
      "item":"Passport",
      "category":"Documents",
      "isPacked":false
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const text = response.text;

  const cleanedText = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const parsedData = JSON.parse(cleanedText);

  return parsedData;
};

const regenerateDayPlan = async (
  destination,
  dayNumber,
  currentActivities,
  userRequest,
) => {
  const prompt = `
You are a travel planner.

Destination: ${destination}

Day Number: ${dayNumber}

Current Activities:
${JSON.stringify(currentActivities)}

User Request:
${userRequest}

Generate a completely updated day plan.

Return ONLY valid JSON.

{
  "dayNumber": ${dayNumber},
  "activities": [
    {
      "title": "",
      "description": "",
      "estimatedCost": 0,
      "timeOfDay": ""
    }
  ]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  const cleanedText = response.text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

module.exports = {
  generateTripPlan,
  regenerateDayPlan,
};
