const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: 2000,
    },
    techStack: {
      type: [String],
      default: [],
    },
    liveUrl: {
      type: String,
      default: '',
      trim: true,
    },
    githubUrl: {
      type: String,
      default: '',
      trim: true,
    },
    images: {
      type: [
        {
          filename: String,
          path: String,
          originalName: String,
        },
      ],
      validate: {
        validator(value) {
          return Array.isArray(value) && value.length > 0 && value.length <= 10;
        },
        message: 'Provide between 1 and 10 project images',
      },
    },
    featured: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
