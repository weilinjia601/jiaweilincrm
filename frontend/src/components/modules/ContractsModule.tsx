import { useState } from 'react';
import { useGetAllContracts, useCreateContract, useUpdateContract, useDeleteContract, useGetAllCustomers } from '../../hooks/useQueries';
import type { Contract } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function ContractsModule() {
  const { data: contracts = [], isLoading } = useGetAllContracts();
  const { data: customers = [] } = useGetAllCustomers();
  const createContract = useCreateContract();
  const updateContract = useUpdateContract();
  const deleteContract = useDeleteContract();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [formData, setFormData] = useState({
    details: '',
    clientId: '',
    startDate: '',
    endDate: '',
    productName: '',
    model: '',
    quantity: '',
    price: '',
    remarks: '',
  });

  const getCustomerName = (clientId: bigint) => {
    const customer = customers.find((c) => c.id === clientId);
    return customer?.name || '未知客户';
  };

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getCustomerName(contract.clientId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        details: contract.details,
        clientId: contract.clientId.toString(),
        startDate: contract.startDate,
        endDate: contract.endDate,
        productName: contract.productName,
        model: contract.model,
        quantity: contract.quantity.toString(),
        price: contract.price.toString(),
        remarks: contract.remarks,
      });
    } else {
      setEditingContract(null);
      setFormData({ 
        details: '', 
        clientId: '', 
        startDate: '', 
        endDate: '',
        productName: '',
        model: '',
        quantity: '',
        price: '',
        remarks: '',
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.details.trim() || !formData.clientId || !formData.startDate || !formData.endDate) {
      toast.error('请填写所有必填字段');
      return;
    }

    try {
      const contractData: Contract = {
        id: editingContract ? editingContract.id : BigInt(Date.now()),
        details: formData.details.trim(),
        clientId: BigInt(formData.clientId),
        startDate: formData.startDate,
        endDate: formData.endDate,
        productName: formData.productName.trim(),
        model: formData.model.trim(),
        quantity: formData.quantity ? BigInt(formData.quantity) : BigInt(0),
        price: formData.price ? BigInt(formData.price) : BigInt(0),
        remarks: formData.remarks.trim(),
      };

      if (editingContract) {
        await updateContract.mutateAsync(contractData);
        toast.success('合同已更新');
      } else {
        await createContract.mutateAsync(contractData);
        toast.success('合同已创建');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('操作失败，请重试');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteContract.mutateAsync(deletingId);
      toast.success('合同已删除');
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
          <h2 className="text-3xl font-bold">合同管理</h2>
          <p className="text-muted-foreground mt-1">管理客户合同和协议</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          添加合同
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索合同详情、客户或产品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredContracts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无合同数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>客户</TableHead>
                    <TableHead>合同详情</TableHead>
                    <TableHead>产品名称</TableHead>
                    <TableHead>规格型号</TableHead>
                    <TableHead>数量</TableHead>
                    <TableHead>价格</TableHead>
                    <TableHead>开始日期</TableHead>
                    <TableHead>结束日期</TableHead>
                    <TableHead>备注</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContracts.map((contract) => (
                    <TableRow key={contract.id.toString()}>
                      <TableCell className="font-medium">{getCustomerName(contract.clientId)}</TableCell>
                      <TableCell className="max-w-xs truncate">{contract.details}</TableCell>
                      <TableCell>{contract.productName || '-'}</TableCell>
                      <TableCell>{contract.model || '-'}</TableCell>
                      <TableCell>{contract.quantity.toString()}</TableCell>
                      <TableCell>¥{contract.price.toString()}</TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell className="max-w-xs truncate">{contract.remarks || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(contract)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(contract.id);
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingContract ? '编辑合同' : '添加合同'}</DialogTitle>
            <DialogDescription>
              {editingContract ? '修改合同信息' : '填写新合同的详细信息'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="clientId">客户 *</Label>
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
              <Label htmlFor="details">合同详情 *</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="请输入合同详情"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">开始日期 *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">结束日期 *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-semibold mb-4">产品信息</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productName">产品名称</Label>
                  <Input
                    id="productName"
                    value={formData.productName}
                    onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                    placeholder="请输入产品名称"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="model">规格型号</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    placeholder="请输入规格型号"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">数量</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="price">价格 (¥)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="remarks">备注</Label>
                  <Textarea
                    id="remarks"
                    value={formData.remarks}
                    onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                    placeholder="请输入备注信息"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={createContract.isPending || updateContract.isPending}>
                {createContract.isPending || updateContract.isPending ? '保存中...' : '保存'}
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
              此操作无法撤销。确定要删除这个合同吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteContract.isPending}>
              {deleteContract.isPending ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
