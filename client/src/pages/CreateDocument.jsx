import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import ShareSettings from "../Components/ShareSettings";

const CreateDocument = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const navigate = useNavigate();
  const [showSharing, setShowSharing] = useState(false);
  const [documentId, setDocumentId] = useState(null);

   const extractMentions = (text) => {
    const matches = text.match(/@\w+/g);
    return matches ? matches.map((m) => m.substring(1)) : [];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const mentions=extractMentions(content);
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/documents", { title, content, isPublic,mentions}, {
        headers: { Authorization: token }
      });
      setDocumentId(res.data._id);
      setShowSharing(true);
      navigate("/dashboard");
    } catch (err) {
      alert("Error creating document");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Create Document</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Document Title"
          className="w-full mb-4 p-2 border rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <ReactQuill
          value={content}
          onChange={setContent}
          className="mb-4 bg-white"
        />
        <div className="flex items-center gap-2 mb-4">
          <input type="checkbox" id="isPublic" checked={isPublic} onChange={() => setIsPublic(!isPublic)} />
          <label htmlFor="isPublic">Make Public</label>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Save Document
        </button>
      </form>
      {documentId && (
  <>
    <button
      onClick={() => setShowSharing(true)}
      className="mt-4 text-sm text-blue-600 underline"
    >
      🔐 Manage Sharing
    </button>

    {showSharing && (
      <ShareSettings documentId={documentId} onClose={() => setShowSharing(false)} />
    )}
  </>
)}
    </div>
  );
};

export default CreateDocument;
