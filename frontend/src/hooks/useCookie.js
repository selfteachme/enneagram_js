import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export const useCookie = ({ key }) => {
  const initial = Cookies.get(key);
  const [cookie, setCookie] = useState(initial);

  useEffect(() => {
    if (cookie && cookie !== undefined) {
      Cookies.set(key, cookie, { expires: 1, sameSite: "strict" });
    }
  }, [key, cookie]);

  return [cookie, setCookie];
};
