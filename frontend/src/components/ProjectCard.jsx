import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProjectCard({ project }) {
  const images = project.images || [];
  const [active, setActive] = useState(0);
  const main = images[active] || images[0];

  return (
    <motion.article
      className="animated-card project-card"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5 }}
    >
      {main ? (
        <div className="project-media">
          <div className="project-cover">
            <img src={main.url} alt={project.title} loading="lazy" />
          </div>
          {images.length > 1 ? (
            <div className="project-thumbs">
              {images.map((img, index) => (
                <button
                  key={img.filename || img.url}
                  type="button"
                  className={`project-thumb ${index === active ? 'is-active' : ''}`}
                  onClick={() => setActive(index)}
                  aria-label={`Show image ${index + 1}`}
                >
                  <img src={img.url} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
      </div>

      {project.techStack?.length > 0 && (
        <div className="chip-row">
          {project.techStack.map((tech) => (
            <span className="chip" key={tech}>
              {tech}
            </span>
          ))}
        </div>
      )}

      <div className="admin-actions">
        {project.liveUrl ? (
          <a className="btn" href={project.liveUrl} target="_blank" rel="noreferrer">
            Live
          </a>
        ) : null}
        {project.githubUrl ? (
          <a className="btn" href={project.githubUrl} target="_blank" rel="noreferrer">
            Code
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}
