import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link component
import { useSelector } from 'react-redux';
import UserTable from './UserTable';
import { BASE_URL } from './../api/apiService';

function Dashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.isAdmin) {
        fetchAllUsers();
      } else {
        setShowCredentials(false); // Hide credentials message for non-admin users
      }
    } else {
      setShowCredentials(true); // Display credentials message if currentUser is null
    }
  }, [currentUser]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/user/getall`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error('Failed to fetch users:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:max-w-screen-md">
        <h1 className="text-3xl font-semibold mb-4 text-center">Dashboard</h1>
        {showCredentials && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-2">Login Credentials</h2>
            <p className="text-gray-800">
              Use the following credentials to login for admin management:
            </p>
            <p className="text-gray-800">
              Email: admin@email.com <br />
              Password: Admin@123
            </p>
            <Link to="/signin" className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-300 mt-2 inline-block">
  Login
</Link>


          </div>
        )}
        {currentUser && currentUser.isAdmin && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-lg font-semibold mb-2">All Users</h2>
            <UserTable users={users} />
          </div>
        )}
        {currentUser && !currentUser.isAdmin && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <span className="text-gray-600">Name:</span>
                <span className="text-gray-800">{currentUser.name}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-800">{currentUser.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-600">Gender:</span>
                <span className="text-gray-800">{currentUser.gender}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
