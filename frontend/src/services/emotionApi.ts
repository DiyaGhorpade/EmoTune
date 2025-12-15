const API_BASE_URL = "http://127.0.0.1:8000";

export async function detectEmotion(image: File) {
  const formData = new FormData();

 
  formData.append("image", image);

  const response = await fetch(`${API_BASE_URL}/emotion`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
