import { useRef, useEffect, useState } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

const BlurText = ({
  text = '',
  delay = 200,
  className = '',
  animateBy = 'words', // 'words' or 'letters'
  direction = 'top', // 'top' or 'bottom'
  threshold = 0.1,
  rootMargin = '0px',
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: rootMargin });

  useEffect(() => {
    if (isInView) {
      setInView(true);
    }
  }, [isInView]);

  const defaultFrom =
    direction === 'top'
      ? { filter: 'blur(10px)', opacity: 0, transform: 'translateY(-20px)' }
      : { filter: 'blur(10px)', opacity: 0, transform: 'translateY(20px)' };

  const defaultTo = {
    filter: 'blur(0px)',
    opacity: 1,
    transform: 'translateY(0px)',
  };

  return (
    <p ref={ref} className={className}>
      {elements.map((element, index) => (
        <motion.span
          key={index}
          initial={defaultFrom}
          animate={inView ? defaultTo : defaultFrom}
          transition={{
            duration: 0.8,
            delay: index * (delay / 1000),
            ease: [0.25, 0.4, 0.25, 1],
          }}
          className="inline-block"
          style={{ whiteSpace: animateBy === 'words' ? 'normal' : 'pre' }}
        >
          {element === ' ' ? '\u00A0' : element}
          {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
        </motion.span>
      ))}
    </p>
  );
};

export default BlurText;
