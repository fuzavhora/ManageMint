import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Admin/AdminLayout';

const RejectedUsers = () => {
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchRejectedUsers();
  }, []);

  const fetchRejectedUsers = async () => {
    try {
      const response = await fetchUser('admin/rejected-users');
      setRejectedUsers(response.data);
    } catch (error) {
      console.error('Error fetching rejected users:', error);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-6">Rejected Users</h2>
        <div className="grid gap-4">
          {rejectedUsers.map(user => (
            <div key={user._id} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                    <p>Age: {user.age}</p>
                    <p>Gender: {user.gender}</p>
                    <p>Phone: {user.Number}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Rejected on:</p>
                  <p className="text-sm">{new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm font-semibold">Reason for Rejection:</p>
                <p className="text-gray-700 mt-1">{user.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default RejectedUsers;