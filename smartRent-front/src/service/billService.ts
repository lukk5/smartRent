import { apiUrl } from "../env";
import { Bill, BillForRow } from "../models/billModel";

async function getForRows
(id: string | undefined) : Promise<BillForRow[]> 
{
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}bill/getByLandLordId/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as BillForRow[];
}


async function getByRentIdForRows(id:string): Promise<BillForRow[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}bill/getByRentIdForRows/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as BillForRow[];
}



async function getByRentId
(id: string | undefined) : Promise<Bill[]> 
{
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}bill/getByObjectId/${id}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as Bill[];
}


export 
{
    getForRows,
    getByRentIdForRows
}