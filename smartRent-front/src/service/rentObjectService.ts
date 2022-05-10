import unfetch from "unfetch";
import { Rent, RentDetail, RentHistoryItem, RentObject, RentObjectForNavBar } from "../models/rentObjectModel";
import { apiUrl }  from "../env"


async function getRentDetailsById(id:string | undefined): Promise<RentDetail | null> {
  const token = window.localStorage.getItem("token");

  if(typeof id === "undefined") return null;

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}rentObject/getRentDetailsById/${id}`,
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
  return data as RentDetail;
  
}


async function getRentObjectForNavBarByUserId(
  id: string
): Promise<RentObjectForNavBar[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}rentObject/getForHeaderByUserId/${id}`,
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
  return data as RentObjectForNavBar[];
}

async function getRentObjectsListByLandLordId(
  id: string | undefined
): Promise<RentObject[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}rentObject/getByLandLordId/${id}`,
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
  return data as RentObject[];
}

async function getRentObjectById(id:string) 
: Promise<RentObject | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}rentObject/getById/${id}`,
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
  return data as RentObject;
}

async function getRentByObjectId(id: string)
: Promise<Rent | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}rentObject/getRentById/${id}`,
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
  return data as Rent;
}

async function updateRentObject(rentObj:RentObject) {

  const token = window.localStorage.getItem("token");
  
  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof rentObj === "undefined") throw new Error("User not exists.");

  const response = await unfetch(
    `${apiUrl}rentObject/updateRentObject`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rentObj)
    }
  );

  if(response.status !== 200)
  {
    throw new Error("Update unsuccessful.");
  }
}


async function updateRent(rent:Rent) {

  const token = window.localStorage.getItem("token");
  
  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof rent === "undefined") throw new Error("User not exists.");

  const response = await unfetch(
    `${apiUrl}rentObject/updateRent`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(rent)
    }
  );
  if(response.status !== 200)
  {
    throw new Error("Update unsuccessful.");
  }
}


async function getRentsHistoryByObjectId(id: string) : Promise<RentHistoryItem[] | null> 
{
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}rentObject/getRentsHistoryById/${id}`,
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
  return data as RentHistoryItem[];
}


export 
{
  getRentObjectForNavBarByUserId,
  getRentObjectsListByLandLordId,
  getRentByObjectId,
  getRentObjectById,
  getRentDetailsById,
  updateRent,
  updateRentObject,
  getRentsHistoryByObjectId
}
