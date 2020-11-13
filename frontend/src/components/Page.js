import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuthState } from "../state";

const safeRoutes = ["/", "/what", "/terms-conditions", "/familiar"];

const Page = ({ children }) => {
  const { isAuthenticated, userIdCookie } = useAuthState();
  const router = useRouter();
  const currentRoute = router.pathname;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated === undefined && !safeRoutes.includes(currentRoute)) {
      router.push("/");
    } else if (isAuthenticated != 0) {
      setLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <div className="flex flex-col justify-between bg-gray-300 h-screen bg-background bg-cover bg-fixed overflow-y-scroll">
      {/* LOGO */}
      <div className="lg:container mx-auto flex-1 mb-10 min-h-40 ">
        <div className="border-l-2 border-black h-full flex items-center relative ml-24">
          <img
            className="sm:w-24 sm:h-24 md:w-32 md:h-32 relative lg:-left-16 -left-1/2"
            src="/img/logo.svg"
            alt="Enneamom"
          />
        </div>
      </div>

      {/* CONTENT */}
      {!loading && children}
    </div>
  );
};

export { Page };
