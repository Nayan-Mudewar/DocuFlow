import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import ShareSettings from "../Components/ShareSettings";
const EditDocument = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [showSharing, setShowSharing] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/documents/${id}`, {
        headers: { Authorization: token },
      });
      setTitle(res.data.title);
      setContent(res.data.content);
      setIsPublic(res.data.isPublic);
    };
    fetchDoc();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/documents/${id}`, { title, content, isPublic }, {
      headers: { Authorization: token },
    });
    navigate("/dashboard");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Edit Document</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          className="w-full mb-4 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ReactQuill value={content} onChange={setContent} className="mb-4 bg-white" />
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="isPublic" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
          <label htmlFor="isPublic">Make Public</label>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
      </form>
      <button
      onClick={() => setShowSharing(true)}
      className="mt-4 text-sm text-blue-600 underline"
    >
      🔐 Manage Sharing
    </button>
      {showSharing && (
      <ShareSettings documentId={id} onClose={() => setShowSharing(false)} />
    )}
    </div>
  );
};

export default EditDocument;