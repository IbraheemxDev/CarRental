import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const { currency, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null); 

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/v1/bookings/owner-bookings');
      data.success ? setBookings(data.data) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/v1/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  return (
    <div className="px-4 pt-8 md:px-10 w-full">
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests and manage booking statuses."
      />
      <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6">
        <table className="w-full border-collapse text-left text-sm text-gray-600">
          <thead className="text-gray-500">
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings?.filter(booking => booking.car).map((booking, index) => (
              <tr key={index} className="border-t border-borderColor text-gray-500">
                <td className="p-3 flex items-center gap-3">
                  {/*  Image click karke user detail */}
                  <img
                    src={booking.car.image?.url}
                    alt=""
                    className="h-12 w-12 aspect-square rounded-md object-cover cursor-pointer hover:opacity-80 transition"
                    onClick={() => setSelectedUser({ ...booking.user, pickupDate: booking.pickupDate, returnDate: booking.returnDate })}
                    title="Click to view customer details"
                  />
                  <p className="font-medium max-md:hidden">
                    {booking.car?.brand} {booking.car?.model}
                  </p>
                </td>
                <td className="p-3 max-md:hidden">
                  {booking.pickupDate.split('T')[0]} to {booking.returnDate.split('T')[0]}
                </td>
                <td className="p-3">
                  {currency} {booking.price || 0}
                </td>
                <td className="p-3 max-md:hidden">
                  <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">offline</span>
                </td>
                <td className="p-3">
                  {booking.status.toLowerCase() === 'pending' ? (
                    <select
                      onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                      value={booking.status}
                      className="px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                      <option value="Confirmed">Confirmed</option>
                    </select>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${booking.status.toLowerCase() === 'confirmed' ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'}`}>
                      {booking.status}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedUser(null)}
        >
          <div
            className="bg-white rounded-xl shadow-xl p-6 w-80 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-gray-700">Customer Details</h2>
            <div className="flex items-center gap-4">
              <img
                src={selectedUser.image?.url }
                alt=""
                className="h-14 w-14 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-800">{selectedUser.name}</p>
                <p className="text-sm text-gray-500">{selectedUser.email}</p>
              </div>
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p><span className="font-medium text-gray-700">Phone:</span> {selectedUser.phone || 'N/A'}</p>
              <p><span className="font-medium text-gray-700">Joined:</span> {selectedUser.createdAt?.split('T')[0]}</p>
              <p><span className="font-medium text-gray-700">Pickup Date:</span> {selectedUser.pickupDate?.split('T')[0]}</p>
  <p><span className="font-medium text-gray-700">Return Date:</span> {selectedUser.returnDate?.split('T')[0]}</p>
            </div>
            <button
              onClick={() => setSelectedUser(null)}
              className="w-full py-2 bg-primary text-white rounded-lg hover:bg-primary-dull transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;