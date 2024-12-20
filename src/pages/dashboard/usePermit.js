import { useState, useEffect } from "react";
import { getPermit, getAllPermits } from "../../lib/permit";

export const usePermit = (userId) => {
  const [loading, setLoading] = useState(false);
  const [permit, setPermit] = useState(null);

  const fetchPermit = async () => {
    try {
      setLoading(true);
      const permit = await getPermit(userId);
      setPermit(permit);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermit();
  }, []);

  return {
    loading,
    permit,
    fetchPermit,
  };
};

export const usePermits = () => {
  const [loading, setLoading] = useState(false);
  const [permits, setPermits] = useState([]);

  const fetchPermits = async () => {
    try {
      setLoading(true);
      const permits = await getAllPermits();
      setPermits(permits);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermits();
  }, []);

  return {
    loading,
    permits,
    fetchPermits,
  };
};
