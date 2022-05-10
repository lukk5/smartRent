import { Box, Button, Grid, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillTableItem } from "../../../models/billModel";
import { UserProp } from "../../../models/userModel";
import { getTableItemsByUserId } from "../../../service/billService";
import BillTable from "./billTable";

const BillComponent: React.FC<UserProp> = (props) => {
  const [tableItems, setTableItems] = useState<BillTableItem[] | null>([]);
  const [selected, setSelected] = useState<readonly string[]>([]);

  const isSelected = (name: string) => selected.indexOf(name) !== -1;
  let navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (props.user === undefined) return;
      const billTableItems = await getTableItemsByUserId(props.user.id, "true");
      setTableItems(billTableItems);
    };

    fetchData();
  }, [props]);

  const handleOpen = () => {
    navigate(`/bills/${selected}`);
  };

  const handleCreateBill = () => {};

  const handleRemove = () => {};
  return (
    <div>
      <Grid
        container
        alignItems="center"
        justifyContent="center"
        direction={"column"}
        sx={{ margin: 1, xs: "flex", md: "none", marginLeft: 15 }}
      >
        <Grid item xs={6} md={4} sx={{ marginRight: 40, marginBottom: 1 }}>
          <Box
            sx={{
              width: 390,
              height: 40,
              borderRadius: 5,
              p: 2,
              border: 1,
              borderColor: "#646BF5",
              boxShadow: 3,
            }}
          >
            <Button variant="contained" onClick={handleOpen} sx={{align: "center"}}>
              Atidaryti
            </Button>
            <Button
              sx={{ marginLeft: 2 }}
              variant="contained"
              onClick={handleCreateBill}
            >
              Sukurti sąskaitą
            </Button>
            <Button
              sx={{ marginLeft: 2, backgroundColor: "red" }}
              variant="contained"
              onClick={handleRemove}
            >
              Trinti
            </Button>
          </Box>
        </Grid>
        <Grid item xs={6} md={4} sx={{ marginRight: 40 }}>
          <Box
            sx={{
              width: 960,
              height: 800,
              borderRadius: 5,
              p: 2,
              border: 1,
              borderColor: "#646BF5",
              boxShadow: 3,
            }}
          >
            <BillTable
              data={tableItems}
              isSelected={isSelected}
              handleClick={handleClick}
            />
          </Box>
        </Grid>
      </Grid>
    </div>
  );
};

export default BillComponent;
