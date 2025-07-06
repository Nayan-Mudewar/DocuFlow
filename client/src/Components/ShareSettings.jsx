import React, { useEffect, useState } from "react";
import axios from "axios";

const ShareSettings = ({ documentId, onClose }) => {
  const [username, setUsername] = useState("");
  const [permission, setPermission] = useState("view");
  const [sharedUsers, setSharedUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchSharedUsers = async () => {
    const res = await axios.get(`http://localhost:5000/api/documents/${documentId}/shared-users`, {
      headers: { Authorization: token },
    });
    setSharedUsers(res.data);
  };

  useEffect(() => {
    fetchSharedUsers();
  }, [documentId]);

  const handleAdd = async () => {
    if (!username) return;
    await axios.put(`http://localhost:5000/api/documents/${documentId}/share`, {
      username,
      permission,
    }, {
      headers: { Authorization: token },
    });
    setUsername("");
    fetchSharedUsers();
  };

  const handleRemove = async (username) => {
    await axios.put(`http://localhost:5000/api/documents/${documentId}/share`, {
      username,
      remove: true,
    }, {
      headers: { Authorization: token },
    });
    fetchSharedUsers();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Share Settings</h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="@username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border p-2 rounded mb-2"
          />
          <select value={permission} onChange={(e) => setPermission(e.target.value)} className="w-full mb-2 p-2 border rounded">
            <option value="view">View</option>
            <option value="edit">Edit</option>
          </select>
          <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-2 rounded w-full">Add User</button>
        </div>

        <h3 className="font-medium mb-2">Currently Shared With:</h3>
        <ul>
          {sharedUsers.map((user) => (
            <li key={user.username} className="flex justify-between items-center mb-2">
              <span>{user.username} ({user.permission})</span>
              <button onClick={() => handleRemove(user.username)} className="text-red-500">Remove</button>
            </li>
          ))}
        </ul>

        <button onClick={onClose} className="mt-4 text-sm text-gray-500 hover:underline">Close</button>
      </div>
    </div>
  );
};

export default ShareSettings;
