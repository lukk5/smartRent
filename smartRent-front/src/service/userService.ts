import { User, UserContactDetails, UserPassword } from "../models/userModel";

import unfetch from "unfetch";

async function getUserById(
  id: string
): Promise<User | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `http://localhost:27604/api/user/get/${id}`,
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
  return data as User;
}

async function checkOldPassword(user: UserPassword) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await unfetch(
    `http://localhost:27604/api/user/checkOldPassword`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as boolean;
}


async function changeUserContactInfo(user: UserContactDetails) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await unfetch(
    `http://localhost:27604/api/user/updateContactDetail`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response.json();

  if (response.status !== 200) {
    throw new Error(data.error);
  }
  return data as User;
}

async function changeUserPassword(user: UserPassword) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await unfetch(
    `http://localhost:27604/api/user/updatePassword`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(user),
    }
  );

  const data = await response;

  if (data.status !== 200) {
     throw new Error("Change unsusscesful.");
  }
}


export 
{
  getUserById,
  changeUserPassword,
  changeUserContactInfo,
  checkOldPassword
}
