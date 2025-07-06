const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const docCtrl = require('../controllers/documentController');

router.post('/', auth, docCtrl.createDocument);
router.get('/', auth, docCtrl.getAllDocuments);
router.get('/:id', auth, docCtrl.getSingleDocument);
router.put('/:id', auth, docCtrl.updateDocument);
router.delete('/:id', auth, docCtrl.deleteDocument);
router.put('/share/:id', auth, docCtrl.shareDocument);
router.put('/unshare/:id', auth, docCtrl.unshareDocument);

module.exports = router;
