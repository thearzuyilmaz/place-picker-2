export async function fetchAvailablePlaces() {
  const response = await fetch("http://localhost:3000/places");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch places: ${response.status} ${response.statusText}`
    );
  }
  const resData = await response.json();

  return resData.places;
}

export async function fetchUserPlaces() {
  const response = await fetch("http://localhost:3000/user-places");

  if (!response.ok) {
    throw new Error(
      `Failed to fetch places: ${response.status} ${response.statusText}`
    );
  }

  const resData = await response.json();
  console.log("API Response Data:", resData); // API'den gelen veriyi yazdır

  // Eğer resData bir array değilse, boş bir array döndür
  return Array.isArray(resData.places) ? resData.places : [];
}

export async function updateUserPlaces(places) {
  try {
    const response = await fetch("http://localhost:3000/user-places", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(places), // data to be sent as array
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Update successful:", data); // data: { message: "User places updated!" }
    return data;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}
