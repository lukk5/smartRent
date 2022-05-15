import { apiUrl } from "../env";
import {
  Bill,
  BillForRow,
  BillTableItem,
} from "../models/billModel";
import axios from "axios";
import unfetch from "unfetch";

async function create(body:Bill) {
  
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof body === "undefined") throw new Error("Body not exists.");

  const response = await unfetch(`${apiUrl}bill/create`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body)
  })

  if(response.status !== 200) throw new Error("Create unsuccessful.");
}


async function update(body:Bill) {
  
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof body === "undefined") throw new Error("Body not exists.");

  const response = await unfetch(`${apiUrl}bill/update`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body)
  })

  if(response.status !== 200) throw new Error("Update unsuccessful.");
}

async function getForRows(id: string | undefined): Promise<BillForRow[]> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(`${apiUrl}bill/getByLandLordId/${id}`, {
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
  return data as BillForRow[];
}

async function getByRentIdForRows(id: string): Promise<BillForRow[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(`${apiUrl}bill/getByRentIdForRows/${id}`, {
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
  return data as BillForRow[];
}

async function getById(id: string | null | undefined): Promise<Bill | null> {
  if (id === null || typeof id === "undefined") return null;

  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(`${apiUrl}bill/getById/${id}`, {
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
  return data as Bill;
}

async function getByRentId(id: string | undefined): Promise<Bill[]> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(`${apiUrl}bill/getByObjectId/${id}`, {
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

async function getTableItemsByUserId(
  id: string,
  status: string
): Promise<BillTableItem[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}bill/getBillTableItemsByUserIdAndStatus/${id}/${status}`,
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
  return data as BillTableItem[];
}

async function getTableItemsByRentObjectId(
  id: string,
  status: string
): Promise<BillTableItem[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(
    `${apiUrl}bill/getTableItemsByRentObjectId/${id}`,
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
  return data as BillTableItem[];
}


async function removeBill(id: string) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await axios.delete(`${apiUrl}bill/remove/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Unsuccessful upload");
  }
};


export {
  getForRows,
  getByRentIdForRows,
  getByRentId,
  getTableItemsByUserId,
  getById,
  update,
  removeBill,
  create,
  getTableItemsByRentObjectId
};
