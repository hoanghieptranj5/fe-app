import axios from "axios";

const URL: string = process.env.REACT_APP_API_URL as string;

interface CalculatedItem {
  from: number | string;
  to: number | string;
  standardPrice: number;
  usage: number;
  price: number;
}

interface CalculationData {
  total: number;
  totalWithVAT: number;
  items: CalculatedItem[];
}

export const fetchCalculation = async (
  usage: number | string,
  token: string,
): Promise<CalculationData> => {
  try {
    const response = await axios.get(`${URL}/electricPrices/usage/${usage}`, {
      headers: {
        Authorization: token,
      },
    });
    console.log(response.data);
    return response.data?.value;
  } catch (error) {
    throw new Error(`Error fetching data: ${error}`);
  }
};
