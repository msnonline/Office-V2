// useEmailSender.js
import { useState } from "react";
import axios from "axios";

const NotificationSender = () => {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const sendEmail = async (subject, message) => {
    setIsSending(true);
    setError(null);
    setSuccessMessage("");

    // Retrieve the API key from environment variables for Vite.
    // Client-side environment variables in Vite must be prefixed with VITE_.
    const apiKey = import.meta.env.VITE_SEC_API_KEY; // Using a descriptive name

    if (!apiKey) {
      setError("API Key is not configured. Please set VITE_SEC_API_KEY in your Vite environment variables.");
      setIsSending(false);
      return;
    }

    try {
      const response = await axios.post(
        "https://sec-api.vercel.app/telegram",
        {
          subject,
          message,
        },
        {
          // Add the X-API-Key header to the request
          headers: {
            "X-API-Key": apiKey,
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Notification sent successfully!");
      } else {
        // Handle cases where the server responds with a non-200 status
        setError(`Failed to send notification. Status: ${response.status} - ${response.statusText || 'Unknown error'}`);
      }
    } catch (err) {
      // Axios errors have a 'response' property for server errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Error sending notification: ${err.response.status} - ${err.response.data?.message || err.response.statusText}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError("No response received from the server. Check your network connection.");
      } else {
        // Something happened in setting up the request that triggered an Error
        setError(`An unexpected error occurred: ${err.message}`);
      }
      console.error("Notification sending error:", err);
    } finally {
      setIsSending(false);
    }
  };

  return {
    isSending,
    error,
    successMessage,
    sendEmail,
  };
};

export default NotificationSender;

