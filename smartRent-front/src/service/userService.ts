import { User, UserContactDetails, UserPassword } from "../models/userModel";

import unfetch from "unfetch";
import { apiUrl }  from "../env"

async function getUserById(
  id: string
): Promise<User | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}user/get/${id}`,
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
    `${apiUrl}user/checkOldPassword`,
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
    `${apiUrl}user/updateContactDetail`,
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
    `${apiUrl}user/updatePassword`,
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

async function getAllTenants() : Promise<User[]> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}user/getAllTenants`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    }
  );

  const data = await response.json();
  if (response.status !== 200) {
     throw new Error("Change unsusscesful.");
  }
  return data as User[];
}


export 
{
  getUserById,
  changeUserPassword,
  changeUserContactInfo,
  checkOldPassword,
  getAllTenants
}
