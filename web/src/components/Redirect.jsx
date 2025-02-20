import { useEffect, useRef, useState } from "react";
import "../redirect.css";
import { Loader } from "./Loader";

const Redirect = ({ setStep }) => {
  const [count, setCount] = useState(3);
  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCount((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (count <= 0) {
      clearInterval(intervalRef.current);
      setStep("email");
    }
  }, [count, setStep]);

  return (
    <>
      <Loader />
    </>
  );
};

export default Redirect;
