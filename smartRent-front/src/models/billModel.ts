export type Bill = {
    id: string;
    amount: number;
    paid: boolean;
    rentObjectId: string;
    validFrom: string;
    validTo: string;
    tenantName: string;
    name: string;
    title: string;
    paymentDate: string | null;
    fileExist: boolean;
};

export type BillForRow = {
    id: string;
    name: string;
    paid: boolean;
}

export type BillTableItem = {
    id: string;
    name: string;
    paid: string;
    startingDate: string;
    endDate: string;
    tenantName: string;
};
