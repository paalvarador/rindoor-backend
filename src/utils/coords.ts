import axios from 'axios';

export async function geocode(country, province, city, address) {
  const findCoords = `${address}, ${city}, ${province}, ${country}`;

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(findCoords)}&key=${process.env.MAPS_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return `${location.lat},${location.lng}`;
    } else {
      throw new Error(`Geocoding error: ${data.status}`);
    }
  } catch (error) {
    throw new Error(`Error fetching data: ${error.message}`);
  }
}
