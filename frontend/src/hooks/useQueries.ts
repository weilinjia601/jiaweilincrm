import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Customer, Contract, Invoice, Product, FinancialRecord, UserProfile, FinancialSummary } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Customer Queries
export function useGetAllCustomers() {
  const { actor, isFetching } = useActor();

  return useQuery<Customer[]>({
    queryKey: ['customers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCustomers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCustomer(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Customer | null>({
    queryKey: ['customer', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getCustomer(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createCustomer(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useUpdateCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customer: Customer) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCustomer(customer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

export function useDeleteCustomer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteCustomer(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
    },
  });
}

// Contract Queries
export function useGetAllContracts() {
  const { actor, isFetching } = useActor();

  return useQuery<Contract[]>({
    queryKey: ['contracts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllContracts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetContract(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Contract | null>({
    queryKey: ['contract', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getContract(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: Contract) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createContract(contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useUpdateContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contract: Contract) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateContract(contract);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

export function useDeleteContract() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteContract(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
    },
  });
}

// Invoice Queries
export function useGetAllInvoices() {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInvoices();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetInvoice(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Invoice | null>({
    queryKey: ['invoice', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getInvoice(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createInvoice(invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useUpdateInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoice: Invoice) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateInvoice(invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

export function useDeleteInvoice() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteInvoice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
    },
  });
}

// Product Queries
export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useDeleteProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

// Financial Record Queries
export function useGetAllFinancialRecords() {
  const { actor, isFetching } = useActor();

  return useQuery<FinancialRecord[]>({
    queryKey: ['financialRecords'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFinancialRecords();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetFinancialRecord(id: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<FinancialRecord | null>({
    queryKey: ['financialRecord', id?.toString()],
    queryFn: async () => {
      if (!actor || !id) return null;
      return actor.getFinancialRecord(id);
    },
    enabled: !!actor && !isFetching && id !== null,
  });
}

export function useGetFinancialSummary() {
  const { actor, isFetching } = useActor();

  return useQuery<FinancialSummary>({
    queryKey: ['financialSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFinancialSummary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: FinancialRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createFinancialRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
    },
  });
}

export function useUpdateFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: FinancialRecord) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateFinancialRecord(record);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
    },
  });
}

export function useDeleteFinancialRecord() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteFinancialRecord(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financialRecords'] });
      queryClient.invalidateQueries({ queryKey: ['financialSummary'] });
    },
  });
}
