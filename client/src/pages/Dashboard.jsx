import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/documents", {
      headers: { Authorization: token },
    });
    setDocuments(res.data);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this document?");
    if (!confirm) return;
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/documents/${id}`, {
      headers: { Authorization: localStorage.getItem("token") },
    });
    fetchDocuments();
  };

  const filtered = documents.filter(doc =>
    doc.title.toLowerCase().includes(search.toLowerCase()) ||
    doc.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Your Documents</h1>
      <input
        type="text"
        placeholder="Search documents..."
        className="w-full p-2 border rounded mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <div key={doc._id} className="p-4 bg-white rounded shadow">
            <h2 className="text-xl font-semibold">{doc.title}</h2>
            <p className="text-sm text-gray-500">By: {doc.author?.name || "Unknown"}</p>
            <p className="mt-2 text-gray-700 text-sm truncate">{doc.content}</p>
            <p className="text-xs text-gray-400 mt-2">Last updated: {new Date(doc.updatedAt).toLocaleString()}</p>
            <div className="flex gap-4 mt-4">
              <button onClick={() => navigate(`/edit/${doc._id}`)} className="text-blue-600 hover:underline">Edit</button>
              <button onClick={() => handleDelete(doc._id)} className="text-red-500 hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
