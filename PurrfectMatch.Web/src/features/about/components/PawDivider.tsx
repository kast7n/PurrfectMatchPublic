import { Box, styled } from '@mui/material';
import PetsIcon from '@mui/icons-material/Pets';

const PawDividerContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  margin: theme.spacing(6, 0),
  opacity: 0.6,
  '& svg': {
    margin: theme.spacing(0, 1),
    color: theme.palette.primary.main,
    fontSize: '2rem',
  }
}));

export default function PawDivider() {
  return (
    <PawDividerContainer>
      <PetsIcon />
      <PetsIcon />
      <PetsIcon />
    </PawDividerContainer>
  );
}
