import { motion } from 'framer-motion';
import cust1 from '../assets/cust/cust-1.jpeg';
import cust2 from '../assets/cust/cust-2.jpeg';
import cust3 from '../assets/cust/cust-3.jpeg';
import cust4 from '../assets/cust/cust-4.jpeg';

const photos = [
  { src: cust4, alt: 'CUST Hackathon 2026 — 7th position plaque' },
  { src: cust1, alt: 'Receiving Certificate of Achievement at CUST' },
  { src: cust2, alt: 'Presenting at CUST Hackathon 2026' },
  { src: cust3, alt: 'CUST Hackathon 2026 certificates' },
];

export default function Achievements() {
  return (
    <section className="section achievements" id="achievements">
      <div className="container">
        <span className="section-kicker">Achievements</span>
        <h2 className="section-title">CUST Hackathon 2026</h2>
        <p className="section-lead">
          Secured <strong>7th position out of 170+ teams</strong> at Capital University of Science &amp;
          Technology. Built an innovative solution using Heterogeneous Graph Transformer (HGT) and Graph
          Neural Network (GNN) algorithms — recognized for technical excellence, teamwork, and turning a
          complex idea into a working prototype under pressure.
        </p>

        <div className="achievement-gallery">
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              className={`achievement-shot ${index === 0 ? 'is-featured' : ''}`}
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
            >
              <img src={photo.src} alt={photo.alt} loading="lazy" />
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
