
import React, { useState } from 'react';
import Title from '../../components/owner/Title.jsx';
import { assets } from '../../assets/assets.js';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const AddCar = () => {
  const { axios, currency } = useAppContext();
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [featureInput, setFeatureInput] = useState('');
  const [features, setFeatures] = useState([]);
  const [car, setCar] = useState({
    brand: '',
    model: '',
    year: 0,
    pricePerDay: 0,
    category: '',
    transmission: '',
    fuel_type: '',
    seating_capacity: 0,
    location: '',
    description: '',
  });

  const addFeature = () => {
    const trimmed = featureInput.trim();
    if (trimmed && !features.includes(trimmed)) {
      setFeatures((prev) => [...prev, trimmed]);
      setFeatureInput('');
    }
  };

  const removeFeature = (feature) => {
    setFeatures((prev) => prev.filter((f) => f !== feature));
  };

  const onSubmitHandle = async (e) => {
    e.preventDefault();
    if (isLoading) return null;
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('carData', JSON.stringify({ ...car, features }));
      const { data } = await axios.post('/api/v1/owners/add-car', formData);
      if (data.success) {
        toast.success(data.message);
        setImage(null);
        setFeatures([]);
        setFeatureInput('');
        setCar({
          brand: '',
          model: '',
          year: 0,
          pricePerDay: 0,
          category: '',
          transmission: '',
          fuel_type: '',
          seating_capacity: 0,
          location: '',
          description: '',
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-4 py-10 md:px-10 flex-1">
      <Title
        title="Add new car"
        subTitle="Fill in details to list a new car for booking, including pricing availability, and car specifications."
      />
      <form
        onSubmit={onSubmitHandle}
        className="flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl"
      >
        {/* car image */}
        <div className="flex items-center w-full gap-2">
          <label htmlFor="car-image">
            <img
              src={image ? URL.createObjectURL(image) : assets.upload_icon}
              className="h-14 rounded cursor-pointer"
              alt=""
            />
            <input
              type="file"
              id="car-image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="font-sm text-gray-500">Upload a picture of your car</p>
        </div>

        {/* car brand and model */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Brand</label>
            <input
              type="text"
              placeholder="BMW, Audi,Honda..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.brand}
              onChange={(e) => setCar({ ...car, brand: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Model</label>
            <input
              type="text"
              placeholder="e.g X5, AClass, M3..."
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.model}
              onChange={(e) => setCar({ ...car, model: e.target.value })}
            />
          </div>
        </div>

        {/* car year, price, category */}
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Year</label>
            <input
              type="number"
              placeholder="2026"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.year}
              onChange={(e) => setCar({ ...car, year: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Daily Price({currency})</label>
            <input
              type="number"
              placeholder="10000"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.pricePerDay}
              onChange={(e) => setCar({ ...car, pricePerDay: e.target.value })}
            />
          </div>
          <div className="flex flex-col w-full">
            <label>Category</label>
            <select
              onChange={(e) => setCar({ ...car, category: e.target.value })}
              value={car.category}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a category</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
              <option value="Luxury">Luxury</option>
              <option value="Sports">Sports</option>
              <option value="Van">Van</option>
              <option value="Coupe">Coupe</option>
              <option value="Convertible">Convertible</option>
              <option value="Pickup Truck">Pickup Truck</option>
              <option value="Crossover">Crossover</option>
              <option value="Minivan">Minivan</option>
              <option value="Wagon">Wagon</option>
              <option value="Electric">Electric</option>
            </select>
          </div>
        </div>

        {/* car transmission, fuel type, seating capacity */}
        <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2 gap-6">
          <div className="flex flex-col w-full">
            <label>Transmission</label>
            <select
              onChange={(e) => setCar({ ...car, transmission: e.target.value })}
              value={car.transmission}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a transmission</option>
              <option value="Automatic">Automatic</option>
              <option value="Semi-Automatic">Semi-Automatic</option>
              <option value="Manual">Manual</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Fuel Type</label>
            <select
              onChange={(e) => setCar({ ...car, fuel_type: e.target.value })}
              value={car.fuel_type}
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            >
              <option value="">Select a fuel type</option>
              <option value="Petrol">Petrol</option>
              <option value="Gas">Gas</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div className="flex flex-col w-full">
            <label>Seating Capacity</label>
            <input
              type="number"
              placeholder="4"
              required
              className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
              value={car.seating_capacity}
              onChange={(e) => setCar({ ...car, seating_capacity: e.target.value })}
            />
          </div>
        </div>

        {/* car location */}
        <div className="flex flex-col w-full">
          <label>Location</label>
          <input
    type="text"
    placeholder="e.g. Lahore, Karachi, Islamabad..."
    required
    className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
    value={car.location}
    onChange={(e) => setCar({ ...car, location: e.target.value })}
  />
        </div>

        {/* ✅ Features */}
        <div className="flex flex-col">
          <label>Features</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              placeholder="e.g. GPS, Sunroof, Bluetooth..."
              className="px-3 py-2 border border-borderColor rounded-md outline-none flex-1"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dull"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {features.map((feature) => (
              <span
                key={feature}
                className="flex items-center gap-1 bg-primary/10 text-primary text-sm px-3 py-1 rounded-full"
              >
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(feature)}
                  className="hover:text-red-500 font-bold ml-1"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        </div>
        {/* description */}
        <div className="flex flex-col">
          <label>Description</label>
          <textarea
            rows={5}
            placeholder="e.g. A luxurious SUV with a spacious interior and a powerful engine."
            required
            className="px-3 py-2 mt-1 border border-borderColor rounded-md outline-none"
            value={car.description}
            onChange={(e) => setCar({ ...car, description: e.target.value })}
          ></textarea>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 mt-4 bg-primary
         text-white rounded-md font-medium w-max cursor-pointer"
        >
          <img src={assets.tick_icon} alt="" />
          {isLoading ? 'Listing...' : 'List Your Car'}
        </button>
      </form>
    </div>
  );
};

export default AddCar;
