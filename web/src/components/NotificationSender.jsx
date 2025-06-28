// useEmailSender.js
import { useState } from "react";
// No axios import needed anymore

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
      const response = await fetch(
        "https://sec-api.vercel.app/telegram",
        {
          method: "POST", // Specify the HTTP method as POST
          headers: {
            "Content-Type": "application/json", // Indicate that the body is JSON
            "X-API-Key": apiKey, // Add the X-API-Key header
          },
          body: JSON.stringify({ // Stringify the JavaScript object to JSON string
            subject,
            message,
          }),
        }
      );

      // Check if the response was successful (status code 200-299)
      if (response.ok) {
        setSuccessMessage("Notification sent successfully!");
      } else {
        // Handle non-successful responses
        let errorMessage = `Failed to send notification. Status: ${response.status}`;
        try {
          const errorData = await response.json(); // Try to parse error response as JSON
          if (errorData && errorData.message) {
            errorMessage += ` - ${errorData.message}`;
          }
        } catch (jsonError) {
          // If the response is not valid JSON, use the status text
          errorMessage += ` - ${response.statusText || 'Unknown error'}`;
        }
        setError(errorMessage);
      }
    } catch (err) {
      // This catch block handles network errors or issues during fetch setup
      setError(`An unexpected error occurred: ${err.message}. Please check your network connection.`);
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

