export async function uploadImageForEmotion(file) {
  console.log("uploadImageForEmotion called with file:", file.name, file.size, file.type);
  
  const formData = new FormData();
  formData.append("image", file);

  console.log("Sending request to http://localhost:8000/api/emotion/recommend/");

  const response = await fetch(
    "http://127.0.0.1:8000/api/emotion/recommend/",
    {
      method: "POST",
      body: formData
    }
  );

  console.log("Response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Response error:", errorText);
    throw new Error("Failed to analyze emotion");
  }

  const result = await response.json();
  console.log("Response data:", result);
  return result;
}

// Alias for compatibility
export const analyzeEmotion = uploadImageForEmotion;
