import CryptoJS from "crypto-js";
import { TUserPayloadLS } from "../types";

// Secret key for encryption
const SECRET_KEY = import.meta.env.REACT_APP_LS_SECRET_KEY || "23421234343434";

const AuthLocalStorage = {
  /**
   * Stores user data securely in local storage
   * @param {string} key - The key under which the data will be stored
   * @param {object} data - The user data to store
   */
  storeUserData: (key: string, data: TUserPayloadLS) => {
    try {
      // Encrypt the data
      const encryptedData = CryptoJS.AES.encrypt(
        JSON.stringify(data),
        SECRET_KEY
      ).toString();
      localStorage.setItem(key, encryptedData);
    } catch (error) {
      console.error("Error storing data:", error);
    }
  },

  /**
   * Retrieves and decrypts user data from local storage
   * @param {string} key - The key of the stored data
   * @returns {object|null} - The decrypted user data or null if not found
   */
  getUserData: (key: string): TUserPayloadLS | null => {
    try {
      const encryptedData = localStorage.getItem(key);
      if (!encryptedData) {
        console.warn("No data found for the given key.");
        return null;
      }
      // Decrypt the data
      const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      return decryptedData;
    } catch (error) {
      console.error("Error retrieving data:", error);
      return null;
    }
  },

  /**
   * Removes user data from local storage
   * @param {string} key - The key of the data to remove
   */
  removeUserData: (key: string) => {
    try {
      localStorage.removeItem(key);
      console.log("Data removed successfully!");
    } catch (error) {
      console.error("Error removing data:", error);
    }
  },
};

export default AuthLocalStorage;
