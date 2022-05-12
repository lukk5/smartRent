export function translateDocumentTypeToLt(type: string) : string
{
  switch(type)
  {
    case "Contract": return "Sutartis";
    case "InventoryList": return "Inventorizacija";
    case "Other": return "Kita";
    default: return "";
  }
}


export function translateDocumentTypeToEn(type: string) : string
{
  switch(type)
  {
    case "Sutartis": return "Contract";
    case "Inventorizacija": return "InventoryList";
    case "Kita": return "Other";
    default: return "";
  }
}
