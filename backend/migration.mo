import OrderedMap "mo:base/OrderedMap";
import Nat "mo:base/Nat";
import Principal "mo:base/Principal";

module {
  type OldUserProfile = {
    name : Text;
  };

  type OldCustomer = {
    id : Nat;
    name : Text;
    contactInfo : Text;
    company : Text;
  };

  type OldContract = {
    id : Nat;
    details : Text;
    clientId : Nat;
    startDate : Text;
    endDate : Text;
    productName : Text;
    model : Text;
    quantity : Nat;
    price : Nat;
    remarks : Text;
  };

  type OldInvoice = {
    id : Nat;
    number : Text;
    date : Text;
    amount : Nat;
    clientId : Nat;
  };

  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
  };

  type OldFinancialRecord = {
    id : Nat;
    transactionDetails : Text;
    recordType : Text;
    amount : Nat;
  };

  type OldActor = {
    userProfiles : OrderedMap.Map<Principal, OldUserProfile>;
    customers : OrderedMap.Map<Nat, OldCustomer>;
    contracts : OrderedMap.Map<Nat, OldContract>;
    invoices : OrderedMap.Map<Nat, OldInvoice>;
    products : OrderedMap.Map<Nat, OldProduct>;
    financialRecords : OrderedMap.Map<Nat, OldFinancialRecord>;
  };

  type NewUserProfile = {
    name : Text;
  };

  type NewCustomer = {
    id : Nat;
    name : Text;
    contactInfo : Text;
    company : Text;
  };

  type NewContract = {
    id : Nat;
    details : Text;
    clientId : Nat;
    startDate : Text;
    endDate : Text;
    productName : Text;
    model : Text;
    quantity : Nat;
    price : Nat;
    remarks : Text;
  };

  type NewInvoice = {
    id : Nat;
    number : Text;
    date : Text;
    amount : Nat;
    clientId : Nat;
  };

  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
  };

  type NewFinancialRecord = {
    id : Nat;
    transactionDetails : Text;
    recordType : Text;
    amount : Nat;
  };

  type NewActor = {
    userProfiles : OrderedMap.Map<Principal, NewUserProfile>;
    customers : OrderedMap.Map<Nat, NewCustomer>;
    contracts : OrderedMap.Map<Nat, NewContract>;
    invoices : OrderedMap.Map<Nat, NewInvoice>;
    products : OrderedMap.Map<Nat, NewProduct>;
    financialRecords : OrderedMap.Map<Nat, NewFinancialRecord>;
  };

  public func run(old : OldActor) : NewActor {
    let natMap = OrderedMap.Make<Nat>(Nat.compare);
    let principalMap = OrderedMap.Make<Principal>(Principal.compare);

    {
      userProfiles = old.userProfiles;
      customers = old.customers;
      contracts = old.contracts;
      invoices = old.invoices;
      products = old.products;
      financialRecords = old.financialRecords;
    };
  };
};
