// documentController.js (cleaned & fixed)
const Document = require("../models/Document");
const User = require("../models/User");

exports.createDocument = async (req, res) => {
  try {
    const { title, content, isPublic } = req.body;

    const newDoc = await Document.create({
      title,
      content,
      isPublic,
      author: req.user
    });

    // Extract mentions from content
    const mentionedUsernames = content.match(/@\w+/g)?.map(u => u.slice(1)) || [];
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });

    mentionedUsers.forEach(user => {
      if (!newDoc.sharedWith.some(s => s.user.equals(user._id))) {
        newDoc.sharedWith.push({ user: user._id, canEdit: false });
      }
    });

    await newDoc.save();
    res.status(201).json(newDoc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating document" });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const docs = await Document.find({
      $or: [
        { author: req.user },
        { isPublic: true },
        { "sharedWith.user": req.user }
      ]
    }).populate("author", "name email");

    res.json(docs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching documents" });
  }
};

exports.getSingleDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    const isOwner = doc.author.toString() === req.user;
    const isShared = doc.sharedWith.some(s => s.user.toString() === req.user);

    if (!isOwner && !doc.isPublic && !isShared) {
      return res.status(403).json({ msg: "Access denied" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching document" });
  }
};

exports.updateDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    if (doc.author.toString() !== req.user) {
      return res.status(403).json({ msg: "Only author can update" });
    }

    const { title, content, isPublic } = req.body;
    doc.title = title;
    doc.content = content;
    doc.isPublic = isPublic;

    // Handle mentions again
    const mentionedUsernames = content.match(/@\w+/g)?.map(u => u.slice(1)) || [];
    const mentionedUsers = await User.find({ username: { $in: mentionedUsernames } });

    mentionedUsers.forEach(user => {
      if (!doc.sharedWith.some(s => s.user.equals(user._id))) {
        doc.sharedWith.push({ user: user._id, canEdit: false });
      }
    });

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ msg: "Error updating document" });
  }
};

exports.deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    if (doc.author.toString() !== req.user) {
      return res.status(403).json({ msg: "Only author can delete" });
    }

    await doc.deleteOne();
    res.json({ msg: "Deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting document" });
  }
};

exports.shareDocument = async (req, res) => {
  try {
    const { username, permission, remove } = req.body;
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ msg: "Not found" });

    if (doc.author.toString() !== req.user)
      return res.status(403).json({ msg: "Only author can share" });

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ msg: "User not found" });

    if (remove) {
      doc.sharedWith = doc.sharedWith.filter(s => s.user.toString() !== user._id.toString());
    } else {
      const existing = doc.sharedWith.find(s => s.user.toString() === user._id.toString());
      if (existing) existing.canEdit = permission === "edit";
      else doc.sharedWith.push({ user: user._id, canEdit: permission === "edit" });
    }

    await doc.save();
    res.json(doc);
  } catch (err) {
    res.status(500).json({ msg: "Error sharing document" });
  }
};

exports.getSharedUsers = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id).populate("sharedWith.user", "username");
    if (!doc) return res.status(404).json({ msg: "Document not found" });

    if (doc.author.toString() !== req.user)
      return res.status(403).json({ msg: "Only author can view shared users" });

    const users = doc.sharedWith.map(entry => ({
      username: entry.user.username,
      permission: entry.canEdit ? "edit" : "view"
    }));

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching shared users" });
  }
};

exports.unshareDocument = async (req, res) => {
  const { userId } = req.body;
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ msg: 'Not found' });

  if (doc.author.toString() !== req.user)
    return res.status(403).json({ msg: 'Only author can unshare' });

  doc.sharedWith = doc.sharedWith.filter(s => s.user.toString() !== userId);
  await doc.save();
  res.json(doc);
};