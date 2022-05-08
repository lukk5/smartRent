import unfetch from "unfetch";
import { Document, DocumentListItem } from "../models/documentModel";
import { apiUrl }  from "../env"

async function getDocumentById(id: string): Promise<Document | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}document/getById/${id}`,
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
  return data as Document;
}

async function getDocumentsForList(
  id: string
): Promise<DocumentListItem[] | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  const response = await fetch(
    `${apiUrl}document/getByObjectId/${id}`,
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
  return data as DocumentListItem[];
}

async function createDocument(document: Document) {
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

export { getDocumentById, getDocumentsForList };
