import unfetch from "unfetch";
import {
  DocumentModel,
  DocumentFile,
  DocumentTableItem,
} from "../models/documentModel";
import { apiUrl } from "../env";
import axios from "axios";
import { addFile, removeFile } from "./fileService";
import { FileModel } from "../models/fileModel";

async function getDocumentById(id: string | undefined): Promise<DocumentModel | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if(typeof id === "undefined") return null;

  const response = await fetch(`${apiUrl}document/getById/${id}`, {
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
  return data as DocumentModel;
}

async function updateDocument(body:DocumentModel, file:FileModel) {
  
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof body === "undefined") throw new Error("Body not exists.");

  await removeFile(body.id, "document");

  const response = await unfetch(`${apiUrl}document/update`,
  {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify(body)
  })

  await addFile(file);

  if(response.status !== 200) throw new Error("Update unsuccessful.");
}


async function getDocumentsForList(
  id: string
): Promise<DocumentTableItem[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(`${apiUrl}document/getTableItemsByRentObjectId/${id}`, {
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
  return data as DocumentTableItem[];
}

async function createDocument(document: DocumentModel) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await unfetch(`${apiUrl}document/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(document),
  });

  const data = await response;

  if (data.status !== 200) {
    throw new Error("creation unsuccessful");
  }
}

async function RemoveDocument(id: string) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await axios.delete(`${apiUrl}document/remove/${id}`,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status !== 200) {
    throw new Error("Unsuccessful upload");
  }
};

export { getDocumentById, getDocumentsForList, createDocument, RemoveDocument, updateDocument };
