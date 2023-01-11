import { useState, useEffect } from "react";

const usePersist = () => {
  const [persist, setPersist] = useState(
    // if persist doesnt exist in local storage its false to begin with
    JSON.parse(localStorage.getItem("persist")) || false
  );
  // console.log(persist);
  // when persists changes, set that value (true/false) to localStorage
  useEffect(() => {
    localStorage.setItem("persist", JSON.stringify(persist));
  }, [persist]);

  return [persist, setPersist];
};
export default usePersist;
