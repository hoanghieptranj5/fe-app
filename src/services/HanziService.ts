import axios from 'axios';

const URL = process.env.REACT_APP_API_URL;

interface GetRandomHanziResponse {
  hanzi: string[];
}

// ✅ Updated function using axios
export const getRandomHanzi = async (length: number, token: string): Promise<GetRandomHanziResponse> => {
  try {
    const response = await axios.get<GetRandomHanziResponse>(`${URL}/hanzi/random/${length}`, {
      headers: {
        Authorization: token,
      },
    });

    return response.data; // Returns the data directly
  } catch (error: any) {
    console.error("Error fetching Hanzi:", error);
    throw new Error(error.message || "Failed to fetch random Hanzi");
  }
};
