import { apiUrl } from "../env";
import {
  Bill,
  BillFile,
  BillFileResponse,
  BillForRow,
  BillTableItem,
} from "../models/billModel";
import axios from "axios";
import unfetch from "unfetch";


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

async function removeFile(id: string) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await unfetch(`${apiUrl}bill/deleteFile/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) throw new Error("deleting was not completed.");
}

async function getFile(id: string | undefined): Promise<BillFileResponse> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await fetch(`${apiUrl}bill/getFile/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/pdf",
    },
  });

  const responseName = await fetch(`${apiUrl}bill/getFileName/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let result: BillFileResponse = await responseName.json();
  result.file = await response.blob();

  return result;
}

async function addFile(bill: BillFile) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof bill === "undefined" || bill === null)
    throw new Error("User not exists.");

  let formData = new FormData();

  formData.append("id", bill.id);
  formData.append("file", bill.file);

  const response = await axios.post(`${apiUrl}bill/addFile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unsuccessful upload");
  }
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

export {
  getForRows,
  getByRentIdForRows,
  getByRentId,
  getTableItemsByUserId,
  getById,
  addFile,
  getFile,
  removeFile,
  update
};
