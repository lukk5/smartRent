import { string } from "yup";

export type RentObjectForNavBar = {
    id: string;
    name: string;
}

export type RentObject = {
    id: string;
    name: string;
    title: string;
    price: number;
    currency: string;
    landLordId: string;
    dimensions: number;
    type: string;
    address: string;
    rentExist: boolean;
}

export type RentObjectTableItem = {
    id: string;
    name: string;
    title: string;
    type: string;
    address: string;
    rentExist: string;
}

export type Rent = {
    id: string;
    tenantId: string;
    rentObjectId: string;
    startingDate: string;
    endingDate: string;
    active: boolean;
};

export type RentHistoryItem = {
    id: string;
    tenantName: string;
    endDate: string;
};

export type RentDetail  = {
    id: string;
    tenantName: string;
    tenantId: string;
    startDate: string;
    endDate: string;
    hasDebt: boolean;
}