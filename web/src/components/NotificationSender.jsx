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

    try {
      const response = await axios.post(
        "https://sec-api.vercel.app/telegram",
        {
          subject,
          message,
        }
      );
      if (response.status === 200) {
        setSuccessMessage("Email sent successfully!");
      } else {
        setError("Failed to send email.");
      }
    } catch (err) {
      // setError("An error occurred while sending the email : ", err);
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
