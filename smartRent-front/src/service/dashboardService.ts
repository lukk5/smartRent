import { Bill } from "../models/billModel";
import { apiUrl } from "../env";
import { ProfitModel } from "../models/profitModel";

async function getNotPaidBillsByLandLordId(id: string | undefined) : Promise<Bill[] | null>
{
    const token = window.localStorage.getItem("token");

    if (token === null) {
      throw new Error("Token not exists.");
    }
  
    if(typeof id === "undefined") return null;
  
    const response = await fetch(`${apiUrl}dashboard/getNotPaidBillsByLandLordId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
  
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    return data as Bill[];
}

async function getNotPaidBillsByRentObjectId(id: string | undefined) : Promise<Bill[] | null>
{
    const token = window.localStorage.getItem("token");

    if (token === null) {
      throw new Error("Token not exists.");
    }
  
    if(typeof id === "undefined") return null;
  
    const response = await fetch(`${apiUrl}dashboard/getNotPaidBillsByRentObjectId/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
  
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    return data as Bill[];
}

async function getProfit(id: string | undefined) : Promise<ProfitModel | null>
{
    const token = window.localStorage.getItem("token");

    if (token === null) {
      throw new Error("Token not exists.");
    }
  
    if(typeof id === "undefined") return null;
  
    const response = await fetch(`${apiUrl}dashboard/getProfit/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
  
    if (response.status !== 200) {
      throw new Error(data.error);
    }
    return data as ProfitModel;
}


export 
{
    getNotPaidBillsByLandLordId,
    getNotPaidBillsByRentObjectId,
    getProfit
}