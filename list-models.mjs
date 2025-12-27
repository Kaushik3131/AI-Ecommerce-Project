import fs from "fs";
import path from "path";

async function listModels() {
  try {
    // 1. Get API Key from .env.local
    let apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      try {
        const envPath = path.join(process.cwd(), ".env.local");
        if (fs.existsSync(envPath)) {
          const envContent = fs.readFileSync(envPath, "utf8");
          // Simple regex to find the key
          const match = envContent.match(
            /GOOGLE_GENERATIVE_AI_API_KEY=["']?([^"'\s]+)["']?/,
          );
          if (match) {
            apiKey = match[1];
          }
        }
      } catch (e) {
        console.error("Error reading .env.local:", e.message);
      }
    }

    if (!apiKey) {
      console.error(
        "❌ Could not find GOOGLE_GENERATIVE_AI_API_KEY in .env.local",
      );
      return;
    }

    console.log(
      `Using API Key: ${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}`,
    );

    // 2. Call the Google AI API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
    );

    if (response.ok) {
      const data = await response.json();
      console.log("\n=== ✅ AVAILABLE GOOGLE AI MODELS ===\n");

      const models = data.models || [];
      // Sort to group similar models
      models.sort((a, b) => a.name.localeCompare(b.name));

      models.forEach((model) => {
        const isGemini = model.name.toLowerCase().includes("gemini");
        const icon = isGemini ? "✨" : " ";

        console.log(`${icon} Name: ${model.name.replace("models/", "")}`);
        console.log(`   Display: ${model.displayName}`);
        console.log(
          `   Methods: ${model.supportedGenerationMethods?.join(", ")}`,
        );
        console.log("---");
      });

      console.log(`\nTotal models found: ${models.length}`);
    } else {
      const errorText = await response.text();
      console.error(
        `❌ API Request Failed: ${response.status} ${response.statusText}`,
      );
      console.error("Response:", errorText);
    }
  } catch (error) {
    console.error("❌ Script Error:", error.message);
  }
}

listModels();
