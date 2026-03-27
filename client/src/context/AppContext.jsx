import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [user, setUser] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [pickupDate, setPickupDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // function if check user is logged in
  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/api/v1/users/data');
      if (data?.success) {
        setUser(data.data);
        setIsOwner(data.data?.role === 'owner');
      } else {
        // navigate('/');
        setUser(null);
        setIsOwner(false);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setUser(null);
        setIsOwner(false);
        return;
      }
      toast.error(error?.response?.data?.message || error.message);
      setUser(null);
      setIsOwner(false);
    } finally {
      setLoading(false);
    }
  };

  // function to fetch all cars from the server
  const fetchCars = async () => {
    try {
      const { data } = await axios.get('/api/v1/users/cars');
      console.log("API RESPONSE:", data);
      data.success ? setCars(data.data) : toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // function to handle logout
  const logout = async () => {
    try {
      const { data } = await axios.post('/api/v1/users/logout');
      if (data?.success) {
        setUser(null);
        setIsOwner(false);
        navigate('/');
        toast.success(data?.message || 'Logged out successfully');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchUser();
  }, []);


  const value = {
    navigate,
    currency,
    axios,
    user,
    setUser,
    isOwner,
    setIsOwner,
    fetchUser,
    showLogin,
    setShowLogin,
    logout,
    fetchCars,
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    loading,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
