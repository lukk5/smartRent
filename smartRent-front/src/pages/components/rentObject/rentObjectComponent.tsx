import { Box, Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RentObject, RentObjectTableItem } from "../../../models/rentObjectModel";
import { UserProp } from "../../../models/userModel";
import { getRentObjectsListByLandLordId } from "../../../service/rentObjectService";
import RentObjectsTable  from "./rentObjectTable"; 

const RentObjectComponent: React.FC<UserProp> = (props) => {
  const [rentObjects, setRentObjects] = useState<RentObject[] | null>([]);
  const [rentObjectsTableItems, setRentObjectsTableItems] = useState<RentObjectTableItem[]>([]);
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
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  useEffect(()=> {

    const fetchData = async() =>
    {
        const data = await getRentObjectsListByLandLordId(props.user?.id);
        setRentObjects(data);
    };
    fetchData();
  },[]);

  useEffect(()=> {
    convertAndSetData();
  }, [rentObjects])


  const convertAndSetData = () => {
    let result: RentObjectTableItem[] = [];
    rentObjects?.forEach((item)=> {
      const temp: RentObjectTableItem = {
        id: item.id,
        name: item.name,
        title: item.title,
        type: item.type,
        address: item.address,
        rentExist: item.rentExist === true ? "Taip" : "Ne"
      };
      result.push(temp);
    });
    setRentObjectsTableItems(result);
  };

  const handleRemove = () => {
  

  };

  const handleOpen = () => {
    navigate(`/rentObjects/${selected}`);
  };

  const handleCreateRent = () => 
  {

  };

  const handleCreate = () => {

  };

  return (
    <Grid container alignItems="center" direction={"column"}
    justifyContent="center" sx={{ margin: 1, xs: "flex", md: "none", marginLeft: 15}}>
       <Grid item xs={6} md={4} sx={{ marginRight: 40, marginBottom: 1 }}>
              <Box sx={{
            width: 480,
            height: 40,
            borderRadius: 5,
            p: 2,
            border: 1,
            borderColor: "#646BF5",
            boxShadow: 3}}>
              <Button variant="contained" onClick={handleOpen}>
                Atidaryti
                </Button>
              <Button sx={{ marginLeft: 2 }} variant="contained" onClick={handleCreate}>
                Sukurti
                </Button>
                <Button sx={{ marginLeft: 2 }} variant="contained" onClick={handleCreateRent}>
                Sukurti nuomą
                </Button>
                <Button sx={{ marginLeft: 2, backgroundColor: "red"  }} variant="contained" onClick={handleRemove}>
                Trinti
                </Button>
              </Box>
            </Grid>  
      <Grid item xs={6} md={4} sx={{ marginRight: 40}}>
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
        <RentObjectsTable data={rentObjectsTableItems} isSelected={isSelected} handleClick={handleClick}/>
            </Box>
      </Grid>
    </Grid>
  );
};

export default RentObjectComponent;
