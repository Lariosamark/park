import { useState, useEffect, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { getUser } from "../lib/user";
import LoadingPage from "../pages/LoadingPage";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUser = async (uid) => {
    try {
      const user = await getUser(uid);
      setUser(user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (!authUser) {
        navigate("/login");
      } else {
        fetchUser(authUser.uid);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <LoadingPage />;

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
}
