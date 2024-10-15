import { useState, useEffect, useContext, createContext } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../lib/firebase";
import { getUser } from "../lib/user";
import LoadingPage from "../pages/LoadingPage";

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "notifications"),
      where("toId", "==", user.id)
    );
    const unsubscribeNotifications = onSnapshot(q, (querySnapshot) => {
      const notificationsArray = [];
      querySnapshot.forEach((doc) => {
        notificationsArray.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setNotifications(notificationsArray);
    });

    return () => unsubscribeNotifications();
  }, [user]);

  if (loading) return <LoadingPage />;

  return (
    <UserContext.Provider value={{ user, notifications }}>
      {children}
    </UserContext.Provider>
  );
}
