import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface TipListItemProps {
  item: string;
}

export default function TipListItem({ item }: TipListItemProps) {
  return (
    <ListItem disableGutters sx={{ paddingLeft: 0, paddingRight: 0 }}>
      <ListItemIcon sx={{ minWidth: 32, color: 'primary.main' }}>
        <CheckCircleIcon fontSize="small" />
      </ListItemIcon>
      <ListItemText 
        primary={item} 
        primaryTypographyProps={{ 
          variant: 'body2', 
          color: 'text.primary'
        }} 
      />
    </ListItem>
  );
}
