import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    description: string;
    price: bigint;
}
export interface Contract {
    id: bigint;
    model: string;
    clientId: bigint;
    endDate: string;
    productName: string;
    details: string;
    quantity: bigint;
    price: bigint;
    remarks: string;
    startDate: string;
}
export interface Invoice {
    id: bigint;
    clientId: bigint;
    date: string;
    number: string;
    amount: bigint;
}
export interface FinancialRecord {
    id: bigint;
    transactionDetails: string;
    recordType: string;
    amount: bigint;
}
export interface Customer {
    id: bigint;
    contactInfo: string;
    name: string;
    company: string;
}
export interface FinancialSummary {
    balance: bigint;
    totalIncome: bigint;
    totalExpenses: bigint;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createContract(contract: Contract): Promise<void>;
    createCustomer(customer: Customer): Promise<void>;
    createFinancialRecord(record: FinancialRecord): Promise<void>;
    createInvoice(invoice: Invoice): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteContract(id: bigint): Promise<void>;
    deleteCustomer(id: bigint): Promise<void>;
    deleteFinancialRecord(id: bigint): Promise<void>;
    deleteInvoice(id: bigint): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllContracts(): Promise<Array<Contract>>;
    getAllCustomers(): Promise<Array<Customer>>;
    getAllFinancialRecords(): Promise<Array<FinancialRecord>>;
    getAllInvoices(): Promise<Array<Invoice>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContract(id: bigint): Promise<Contract | null>;
    getCustomer(id: bigint): Promise<Customer | null>;
    getFinancialRecord(id: bigint): Promise<FinancialRecord | null>;
    getFinancialSummary(): Promise<FinancialSummary>;
    getInvoice(id: bigint): Promise<Invoice | null>;
    getProduct(id: bigint): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateContract(contract: Contract): Promise<void>;
    updateCustomer(customer: Customer): Promise<void>;
    updateFinancialRecord(record: FinancialRecord): Promise<void>;
    updateInvoice(invoice: Invoice): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}