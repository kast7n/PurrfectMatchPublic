import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import { StepCard, StepNumber, IconCircle, StepTitle, StepDescription, PawPrintPath } from './howItWorksStyles';

interface HowItWorksStepCardProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
  pawColor: string;
  borderColor: string;
  boxShadow: string;
  iconColor: string;
  custom: number;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const HowItWorksStepCard: React.FC<HowItWorksStepCardProps> = ({
  step,
  icon,
  title,
  description,
  imgSrc,
  imgAlt,
  pawColor,
  borderColor,
  boxShadow,
  iconColor,
  custom,
}) => (
  <motion.div
    custom={custom}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin: '-100px' }}
    variants={cardVariants}
    style={{ height: '100%' }}
  >
    <StepCard sx={{ border: `2px solid ${borderColor}`, boxShadow }}>
      <StepNumber>{step}</StepNumber>
      <IconCircle color={iconColor}>{icon}</IconCircle>
      <StepTitle variant="h5">{title}</StepTitle>
      <StepDescription>{description}</StepDescription>
      <Box
        sx={{
          mt: 'auto',
          pt: 2,
          width: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <img
          src={imgSrc}
          alt={imgAlt}
          style={{
            width: '85%',
            maxHeight: 130,
            objectFit: 'contain',
            opacity: 0.95,
            borderRadius: 12,
            boxShadow,
          }}
        />
      </Box>
      <PawPrintPath>
        <span style={{ fontSize: 22, color: pawColor }}>🐾</span>
        <span style={{ fontSize: 22, color: pawColor }}>🐾</span>
        <span style={{ fontSize: 22, color: pawColor }}>🐾</span>
      </PawPrintPath>
    </StepCard>
  </motion.div>
);

export default HowItWorksStepCard;
