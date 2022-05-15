import { Dialog, DialogTitle, DialogContent, DialogContentText, Grid, Typography, Button, DialogActions } from "@mui/material";
import { User } from "../../../models/userModel";

interface ProfileDialogProps {
  user: User | undefined;
  openDialog: boolean;
  setOpenDialogClose: () => void;
}

export const ProfileDialog = (props: ProfileDialogProps) => {
  return (
    <Dialog
      open={props.openDialog}
      onClose={props.setOpenDialogClose}
    >
      <DialogTitle>Vartotojo informacija</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ marginBottom: 2 }}>
         
        </DialogContentText>
        <Grid
          container
          direction="column"
          justifyItems={"center"}
          columnSpacing={3}
          sx={{ marginTop: -3 }}
        >
          <Grid item xs={12}>
            <Typography variant="h6" component="div" gutterBottom>
              Vardas: {props.user?.name}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Pavardė: {props.user?.lastName}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Vartotojo vardas: {props.user?.nickName}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              El.paštas: {props.user?.email}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              Telefono numeris: {props.user?.phone}
            </Typography>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={props.setOpenDialogClose}
        >
          Uždaryti
        </Button>
      </DialogActions>
    </Dialog>
  );
};
