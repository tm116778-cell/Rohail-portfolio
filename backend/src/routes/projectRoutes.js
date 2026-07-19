const express = require('express');
const projectController = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

const router = express.Router();

router.get('/', projectController.getProjects);

router.use(protect);

router.get('/admin/all', projectController.getAllProjectsAdmin);
router.post('/', upload.array('images', 10), projectController.createProject);
router.put('/:id', upload.array('images', 10), projectController.updateProject);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
