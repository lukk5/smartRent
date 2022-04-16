import { User } from "../models/userModel";

async function getUserById(id: string, isLandLord: boolean): Promise<User | null> {

  const token = window.localStorage.getItem("token");

  if(token === null)
  {
    return null;
  }

  const response = await fetch(`http://localhost:27604/api/user/get/${id}/${isLandLord}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
  });

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as User;
}

export default getUserById;
