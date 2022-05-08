export type Bill = {
    id: string;
    amount: number;
    paid: boolean;
    objectId: string;
    validFrom: string;
    validToDate: string;
    content: Blob;
};

export type BillForRow = {
    id: string;
    name: string;
    paid: boolean;
}