import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import AdminLayout from '../../components/Admin/AdminLayout';
import { FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
import toast from 'react-hot-toast';

const PendingUsers = () => {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const { fetchUser } = useAuth();

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      const response = await fetchUser('admin/pending-users');
      setPendingUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      await fetchUser(`admin/verify-user/${userId}`, {}, 'post');
      toast.success('User approved successfully');
      fetchPendingUsers();
    } catch (error) {
      toast.error('Failed to approve user');
    }
  };

  const handleReject = async (userId) => {
    try {
      if (!rejectReason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      await fetchUser(`admin/reject-user/${userId}`, { reason: rejectReason }, 'post');
      toast.success('User rejected successfully');
      setSelectedUser(null);
      setRejectReason('');
      fetchPendingUsers();
    } catch (error) {
      toast.error('Failed to reject user');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <FaSpinner className="animate-spin text-4xl text-blue-500" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Pending Approvals</h2>
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
            {pendingUsers.length} Pending
          </span>
        </div>

        {pendingUsers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">No pending users found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingUsers.map(user => (
              <div key={user._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm text-gray-500">
                      <p>Age: {user.age}</p>
                      <p>Gender: {user.gender}</p>
                      <p>Phone: {user.number}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                    >
                      <FaCheck className="mr-2" /> Approve
                    </button>
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                    >
                      <FaTimes className="mr-2" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
              <h3 className="text-xl font-bold mb-4">Reject User Application</h3>
              <p className="text-gray-600 mb-4">User: {selectedUser.name}</p>
              <textarea
                className="w-full p-3 border rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter reason for rejection"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows="3"
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedUser(null);
                    setRejectReason('');
                  }}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(selectedUser._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default PendingUsers;