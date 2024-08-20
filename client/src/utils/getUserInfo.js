import axios from "axios";
export const getUserInfo = async () => {
  try {
    const response = await axios.get(
      "https://65d4a2e83f1ab8c63435a17e.mockapi.io/loginInfo"
    );
    return response.data;
  } catch (error) {
    throw ("Error fetching data:", error);
  }
};
