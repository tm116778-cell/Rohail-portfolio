const Project = require('../models/Project');
const { cloudinary } = require('../middleware/upload');

const mapProject = (project) => ({
  id: project._id,
  title: project.title,
  description: project.description,
  techStack: project.techStack,
  liveUrl: project.liveUrl,
  githubUrl: project.githubUrl,
  featured: project.featured,
  order: project.order,
  images: project.images.map((img) => ({
    filename: img.filename,
    originalName: img.originalName,
    url: img.path, // Cloudinary URL stored in path field
  })),
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
});

const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ featured: true }).sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.map((p) => mapProject(p)),
    });
  } catch (error) {
    next(error);
  }
};

const getAllProjectsAdmin = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.map((p) => mapProject(p)),
    });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const { title, description, liveUrl = '', githubUrl = '', featured = true, order = 0 } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one project image is required' });
    }

    let techStack = [];
    if (req.body.techStack) {
      try {
        techStack = Array.isArray(req.body.techStack)
          ? req.body.techStack
          : JSON.parse(req.body.techStack);
      } catch {
        techStack = String(req.body.techStack)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    // Cloudinary: file.path = URL, file.filename = public_id
    const images = req.files.map((file) => ({
      filename: file.filename,   // Cloudinary public_id
      path: file.path,           // Cloudinary URL
      originalName: file.originalname,
    }));

    const project = await Project.create({
      title: String(title).trim(),
      description: String(description).trim(),
      techStack,
      liveUrl: String(liveUrl).trim(),
      githubUrl: String(githubUrl).trim(),
      featured: String(featured) !== 'false',
      order: Number(order) || 0,
      images,
      createdBy: req.admin._id,
    });

    res.status(201).json({
      success: true,
      message: 'Project created',
      data: mapProject(project),
    });
  } catch (error) {
    // Delete uploaded images from Cloudinary if project creation fails
    if (req.files?.length) {
      req.files.forEach((file) => {
        cloudinary.uploader.destroy(file.filename).catch(console.error);
      });
    }
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const fields = ['title', 'description', 'liveUrl', 'githubUrl', 'featured', 'order'];
    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'featured') {
          project.featured = String(req.body.featured) !== 'false';
        } else if (field === 'order') {
          project.order = Number(req.body.order) || 0;
        } else {
          project[field] = String(req.body[field]).trim();
        }
      }
    });

    if (req.body.techStack !== undefined) {
      try {
        project.techStack = Array.isArray(req.body.techStack)
          ? req.body.techStack
          : JSON.parse(req.body.techStack);
      } catch {
        project.techStack = String(req.body.techStack)
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean);
      }
    }

    if (req.files?.length) {
      // Delete old images from Cloudinary
      project.images.forEach((img) => {
        cloudinary.uploader.destroy(img.filename).catch(console.error);
      });
      // Save new Cloudinary images
      project.images = req.files.map((file) => ({
        filename: file.filename,
        path: file.path,
        originalName: file.originalname,
      }));
    }

    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project updated',
      data: mapProject(project),
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Delete images from Cloudinary
    project.images.forEach((img) => {
      cloudinary.uploader.destroy(img.filename).catch(console.error);
    });

    await project.deleteOne();

    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject,
};
