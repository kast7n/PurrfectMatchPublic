import { Container, Divider, Paper, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";

export default function ServerError() {
    const {state} = useLocation();
  return (
    <Container component={Paper}>
        {state.error ? (
            <>
                <Typography gutterBottom variant="h3" sx={{px: 4,pt: 2}} color="secondary">
                    {state.error.title}
                </Typography>
                <Divider/>
                <Typography gutterBottom variant="body1" sx={{p: 4}}>
                    {state.error.detail}
                </Typography>
            </>
        )
        : (
            <Typography  variant="h5">
                Server error
            </Typography>
        )
    }
    </Container>
  )
}