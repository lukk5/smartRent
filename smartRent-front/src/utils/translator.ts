export function translateDocumentTypeToLt(type: string | undefined) : string
{
  switch(type)
  {
    case "Contract": return "Sutartis";
    case "InventoryList": return "Inventorizacija";
    case "Other": return "Kita";
    default: return "";
  }
}


export function translateDocumentTypeToEn(type: string | undefined) : string
{
  switch(type)
  {
    case "Sutartis": return "Contract";
    case "Inventorizacija": return "InventoryList";
    case "Kita": return "Other";
    default: return "";
  }
}

export function translateObjectTypeToLt(type: string | undefined) : string 
{
  switch(type)
  {
    case "House": return "Namas";
    case "Apartment": return "Butas";
    case "Garage": return "Garažas";
    case "Vila": return "Vila";
    case "ParkingPlace": return "Parkavimo vieta";
    default: return "";
  }
}
