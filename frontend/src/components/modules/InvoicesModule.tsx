import { useState } from 'react';
import { useGetAllInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice, useGetAllCustomers } from '../../hooks/useQueries';
import type { Invoice } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function InvoicesModule() {
  const { data: invoices = [], isLoading } = useGetAllInvoices();
  const { data: customers = [] } = useGetAllCustomers();
  const createInvoice = useCreateInvoice();
  const updateInvoice = useUpdateInvoice();
  const deleteInvoice = useDeleteInvoice();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [formData, setFormData] = useState({
    number: '',
    date: '',
    amount: '',
    clientId: '',
  });

  const getCustomerName = (clientId: bigint) => {
    const customer = customers.find((c) => c.id === clientId);
    return customer?.name || '未知客户';
  };

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (invoice?: Invoice) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({
        number: invoice.number,
        date: invoice.date,
        amount: invoice.amount.toString(),
        clientId: invoice.clientId.toString(),
      });
    } else {
      setEditingInvoice(null);
      setFormData({ number: '', date: '', amount: '', clientId: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.number.trim() || !formData.date || !formData.amount || !formData.clientId) {
      toast.error('请填写所有字段');
      return;
    }

    const amount = parseInt(formData.amount);
    if (isNaN(amount) || amount < 0) {
      toast.error('请输入有效的金额');
      return;
    }

    try {
      const invoiceData: Invoice = {
        id: editingInvoice ? editingInvoice.id : BigInt(Date.now()),
        number: formData.number.trim(),
        date: formData.date,
        amount: BigInt(amount),
        clientId: BigInt(formData.clientId),
      };

      if (editingInvoice) {
        await updateInvoice.mutateAsync(invoiceData);
        toast.success('发票已更新');
      } else {
        await createInvoice.mutateAsync(invoiceData);
        toast.success('发票已创建');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('操作失败，请重试');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteInvoice.mutateAsync(deletingId);
      toast.success('发票已删除');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast.error('删除失败，请重试');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">加载中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">发票管理</h2>
          <p className="text-muted-foreground mt-1">管理客户发票和账单</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          添加发票
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索发票编号或客户..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无发票数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>发票编号</TableHead>
                    <TableHead>客户</TableHead>
                    <TableHead>日期</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id.toString()}>
                      <TableCell className="font-medium">{invoice.number}</TableCell>
                      <TableCell>{getCustomerName(invoice.clientId)}</TableCell>
                      <TableCell>{invoice.date}</TableCell>
                      <TableCell>¥{invoice.amount.toString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(invoice)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(invoice.id);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingInvoice ? '编辑发票' : '添加发票'}</DialogTitle>
            <DialogDescription>
              {editingInvoice ? '修改发票信息' : '填写新发票的详细信息'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">发票编号</Label>
              <Input
                id="number"
                value={formData.number}
                onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                placeholder="请输入发票编号"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="clientId">客户</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择客户" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id.toString()} value={customer.id.toString()}>
                      {customer.name} - {customer.company}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">日期</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">金额</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="请输入金额"
                min="0"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={createInvoice.isPending || updateInvoice.isPending}>
                {createInvoice.isPending || updateInvoice.isPending ? '保存中...' : '保存'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              此操作无法撤销。确定要删除这个发票吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteInvoice.isPending}>
              {deleteInvoice.isPending ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
