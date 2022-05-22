import { FileModel, FileResponse } from "../models/fileModel";
import { apiUrl } from "../env";
import axios from "axios";
import unfetch from "unfetch";

async function addFile(file: FileModel) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof file === "undefined" || file === null)
    throw new Error("File not exists.");

  let formData = new FormData();

  formData.append("id", file.id);
  formData.append("file", file.file);
  formData.append("fileName", file.fileName);
  formData.append("type", file.type);

  const response = await axios.post(`${apiUrl}file/addFile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unsuccessful upload");
  }
}

async function generateFile(id: string | undefined) {
  const token = window.localStorage.getItem("token");

  console.log(token);

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined" || id === null)
    throw new Error("Id not exists.");

  const response = await axios.post(`${apiUrl}file/renderDocument/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) {
    throw new Error("Unsuccessful render");
  }
}

async function getFile(
  id: string | undefined,
  type: string
): Promise<FileResponse | null> {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await axios.get(`${apiUrl}file/getFileById/${id}/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/octet-stream",
    }
  });

  let data = await response.data;

  const responseName = await fetch(`${apiUrl}file/getFileName/${id}/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  let result: FileResponse = await responseName.json();
  result.file = data;

  return result;
}

async function removeFile(id: string, type: string) {
  const token = window.localStorage.getItem("token");

  if (token === null) {
    throw new Error("Token not exists.");
  }

  if (typeof id === "undefined") throw new Error("User not exists.");

  const response = await unfetch(`${apiUrl}file/deleteFile/${id}/${type}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status !== 200) throw new Error("deleting was not completed.");
}

export { addFile, getFile, removeFile, generateFile };
