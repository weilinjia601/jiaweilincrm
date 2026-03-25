import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Nat "mo:base/Nat";
import Debug "mo:base/Debug";
import Iter "mo:base/Iter";
import Migration "migration";

(with migration = Migration.run)
actor CRM {
  // 初始化访问控制状态
  let accessControlState = AccessControl.initState();

  // 初始化访问控制（第一个调用者成为管理员,其他为普通用户）
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside AccessControl.assignRole
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  // 用户个人信息类型
  public type UserProfile = {
    name : Text;
    // 其他用户元数据
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以保存个人信息");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("未授权：只能查看自己的个人信息");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以保存个人信息");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // 客户类型
  public type Customer = {
    id : Nat;
    name : Text;
    contactInfo : Text;
    company : Text;
  };

  // 合同类型
  public type Contract = {
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

  // 发票类型
  public type Invoice = {
    id : Nat;
    number : Text;
    date : Text;
    amount : Nat;
    clientId : Nat;
  };

  // 产品类型
  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Nat;
  };

  // 财务记录类型
  public type FinancialRecord = {
    id : Nat;
    transactionDetails : Text;
    recordType : Text;
    amount : Nat;
  };

  // 财务汇总类型
  public type FinancialSummary = {
    totalIncome : Nat;
    totalExpenses : Nat;
    balance : Int;
  };

  // OrderedMap 实例
  transient let natMap = OrderedMap.Make<Nat>(Nat.compare);

  // 存储变量
  var customers = natMap.empty<Customer>();
  var contracts = natMap.empty<Contract>();
  var invoices = natMap.empty<Invoice>();
  var products = natMap.empty<Product>();
  var financialRecords = natMap.empty<FinancialRecord>();

  // 客户管理
  public shared ({ caller }) func createCustomer(customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以创建客户");
    };
    customers := natMap.put(customers, customer.id, customer);
  };

  public query ({ caller }) func getCustomer(id : Nat) : async ?Customer {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看客户信息");
    };
    natMap.get(customers, id);
  };

  public query ({ caller }) func getAllCustomers() : async [Customer] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看客户列表");
    };
    Iter.toArray(natMap.vals(customers));
  };

  public shared ({ caller }) func updateCustomer(customer : Customer) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以更新客户信息");
    };
    customers := natMap.put(customers, customer.id, customer);
  };

  public shared ({ caller }) func deleteCustomer(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以删除客户");
    };
    customers := natMap.delete(customers, id);
  };

  // 合同管理
  public shared ({ caller }) func createContract(contract : Contract) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以创建合同");
    };
    contracts := natMap.put(contracts, contract.id, contract);
  };

  public query ({ caller }) func getContract(id : Nat) : async ?Contract {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看合同信息");
    };
    natMap.get(contracts, id);
  };

  public query ({ caller }) func getAllContracts() : async [Contract] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看合同列表");
    };
    Iter.toArray(natMap.vals(contracts));
  };

  public shared ({ caller }) func updateContract(contract : Contract) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以更新合同信息");
    };
    contracts := natMap.put(contracts, contract.id, contract);
  };

  public shared ({ caller }) func deleteContract(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以删除合同");
    };
    contracts := natMap.delete(contracts, id);
  };

  // 发票管理
  public shared ({ caller }) func createInvoice(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以创建发票");
    };
    invoices := natMap.put(invoices, invoice.id, invoice);
  };

  public query ({ caller }) func getInvoice(id : Nat) : async ?Invoice {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看发票信息");
    };
    natMap.get(invoices, id);
  };

  public query ({ caller }) func getAllInvoices() : async [Invoice] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看发票列表");
    };
    Iter.toArray(natMap.vals(invoices));
  };

  public shared ({ caller }) func updateInvoice(invoice : Invoice) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以更新发票信息");
    };
    invoices := natMap.put(invoices, invoice.id, invoice);
  };

  public shared ({ caller }) func deleteInvoice(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以删除发票");
    };
    invoices := natMap.delete(invoices, id);
  };

  // 产品管理
  public shared ({ caller }) func createProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以创建产品");
    };
    products := natMap.put(products, product.id, product);
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看产品信息");
    };
    natMap.get(products, id);
  };

  public query ({ caller }) func getAllProducts() : async [Product] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看产品列表");
    };
    Iter.toArray(natMap.vals(products));
  };

  public shared ({ caller }) func updateProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以更新产品信息");
    };
    products := natMap.put(products, product.id, product);
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以删除产品");
    };
    products := natMap.delete(products, id);
  };

  // 财务记录管理
  public shared ({ caller }) func createFinancialRecord(record : FinancialRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以创建财务记录");
    };
    financialRecords := natMap.put(financialRecords, record.id, record);
  };

  public query ({ caller }) func getFinancialRecord(id : Nat) : async ?FinancialRecord {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看财务记录信息");
    };
    natMap.get(financialRecords, id);
  };

  public query ({ caller }) func getAllFinancialRecords() : async [FinancialRecord] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看财务记录列表");
    };
    Iter.toArray(natMap.vals(financialRecords));
  };

  public shared ({ caller }) func updateFinancialRecord(record : FinancialRecord) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以更新财务记录信息");
    };
    financialRecords := natMap.put(financialRecords, record.id, record);
  };

  public shared ({ caller }) func deleteFinancialRecord(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以删除财务记录");
    };
    financialRecords := natMap.delete(financialRecords, id);
  };

  // 获取财务汇总信息
  public query ({ caller }) func getFinancialSummary() : async FinancialSummary {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("未授权：只有用户可以查看财务汇总信息");
    };

    var totalIncome : Nat = 0;
    var totalExpenses : Nat = 0;

    for (record in natMap.vals(financialRecords)) {
      if (record.recordType == "收入") {
        totalIncome += record.amount;
      } else if (record.recordType == "支出") {
        totalExpenses += record.amount;
      };
    };

    let balance : Int = totalIncome - totalExpenses;

    {
      totalIncome;
      totalExpenses;
      balance;
    };
  };
};
