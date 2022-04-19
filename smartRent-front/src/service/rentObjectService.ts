import unfetch from "unfetch";
import { RentObjectForNavBar } from "../models/rentObjectModel";

async function getRentObjectForNavBarByUserId(
  id: string
): Promise<RentObjectForNavBar[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(`http://localhost:27604/api/rentObject/getForHeaderByUserId/${id}`, {
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

  console.log(response);

  return data as RentObjectForNavBar[];
};

export 
{
    getRentObjectForNavBarByUserId
}
