import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Hero3D from '../components/Hero3D';
import HeroPortrait from '../components/HeroPortrait';
import AnimatedText from '../components/AnimatedText';
import Achievements from '../components/Achievements';
import ProjectCard from '../components/ProjectCard';
import { api } from '../api/client';
import { profile } from '../data/profile';

export default function Portfolio() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    let active = true;
    api
      .getProjects()
      .then((res) => {
        if (active) setProjects(res.data || []);
      })
      .catch(() => {
        if (active) setProjects([]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div id="top">
      <Navbar />

      <section className="hero">
        <Hero3D />
        <div className="container hero-layout">
          <HeroPortrait />
          <div className="hero-content">
            <motion.h1
              className="hero-brand"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {profile.brand}
            </motion.h1>
            <AnimatedText text={profile.name} as="h2" className="hero-title" delay={0.15} />
            <AnimatedText text={profile.tagline} as="p" className="hero-tagline" delay={0.35} />
            <p className="hero-meta">
              {profile.location} · {profile.phone} · {profile.email}
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View Projects
              </a>
              <a className="btn" href={profile.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
              <a className="btn" href={profile.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
        <div className="scroll-hint">Scroll</div>
      </section>

      <section className="section" id="about">
        <div className="container">
          <span className="section-kicker">About</span>
          <h2 className="section-title">Building scalable web & mobile products</h2>
          <AnimatedText text={profile.summary} as="p" className="section-lead" />
          <div className="cards-grid">
            {profile.highlights.map((item) => (
              <motion.article
                key={item.title}
                className="animated-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45 }}
              >
                <h3>{item.title}</h3>
                <div className="meta">
                  {item.subtitle} · {item.stack}
                </div>
                <p>{item.detail}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="experience">
        <div className="container">
          <span className="section-kicker">Experience</span>
          <h2 className="section-title">Where I have shipped work</h2>
          <div className="timeline">
            {profile.experience.map((job) => (
              <article className="timeline-item" key={job.role}>
                <h3>{job.role}</h3>
                <div className="meta">
                  {job.company} · {job.duration}
                </div>
                <ul>
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <Achievements />

      <section className="section" id="projects">
        <div className="container">
          <span className="section-kicker">Featured Projects</span>
          <h2 className="section-title">Selected work</h2>
          <p className="section-lead">
            Projects uploaded from the admin panel appear here with their related images.
          </p>
          {projects.length === 0 ? (
            <p className="section-lead" style={{ marginTop: '1.5rem' }}>
              No projects yet. Log in to Admin and upload your first project.
            </p>
          ) : (
            <div className="cards-grid">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="section" id="skills">
        <div className="container">
          <span className="section-kicker">Skills</span>
          <h2 className="section-title">Tools I use daily</h2>
          <div className="chip-row" style={{ marginTop: '1.5rem' }}>
            {profile.skills.technical.map((skill) => (
              <span className="chip" key={skill}>
                {skill}
              </span>
            ))}
          </div>
          <div className="cards-grid">
            <article className="animated-card">
              <h3>Soft Skills</h3>
              <div className="chip-row" style={{ marginTop: '0.8rem' }}>
                {profile.skills.soft.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                  </span>
                ))}
              </div>
            </article>
            <article className="animated-card">
              <h3>Education</h3>
              {profile.education.map((edu) => (
                <div key={edu.degree} style={{ marginTop: '0.9rem' }}>
                  <strong>{edu.degree}</strong>
                  <p>
                    {edu.school}
                    <br />
                    {edu.years}
                  </p>
                  {edu.note ? <p>{edu.note}</p> : null}
                </div>
              ))}
            </article>
            <article className="animated-card">
              <h3>Certifications</h3>
              <ul style={{ margin: '0.8rem 0 0', paddingLeft: '1.1rem', color: 'var(--muted)', lineHeight: 1.7 }}>
                {profile.certifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <section className="section" id="contact">
        <div className="container">
          <span className="section-kicker">Contact</span>
          <h2 className="section-title">Let&apos;s build something useful</h2>
          <div className="contact-grid">
            <a className="contact-item" href={`mailto:${profile.email}`}>
              <span>Email</span>
              {profile.email}
            </a>
            <a className="contact-item" href={`tel:${profile.phone.replace(/\s/g, '')}`}>
              <span>Phone</span>
              {profile.phone}
            </a>
            <a className="contact-item" href={profile.github} target="_blank" rel="noreferrer">
              <span>GitHub</span>
              github.com/MughA1l
            </a>
            <a className="contact-item" href={profile.linkedin} target="_blank" rel="noreferrer">
              <span>LinkedIn</span>
              Muhammad Rohail
            </a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">© {new Date().getFullYear()} {profile.name}. Built with React, Three.js & MongoDB.</div>
      </footer>
    </div>
  );
}
