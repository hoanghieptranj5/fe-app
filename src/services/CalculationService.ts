import axios from 'axios';

const URL: string = process.env.REACT_APP_API_URL as string;

export const fetchCalculation = async (usage: number | string, token: string): Promise<any> => {
  try {
    const response = await axios.get(`${URL}/electricPrices/usage/${usage}`, {
      headers: {
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};
