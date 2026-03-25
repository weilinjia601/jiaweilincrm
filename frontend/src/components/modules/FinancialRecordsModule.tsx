import { useState } from 'react';
import { useGetAllFinancialRecords, useGetFinancialSummary, useCreateFinancialRecord, useUpdateFinancialRecord, useDeleteFinancialRecord } from '../../hooks/useQueries';
import type { FinancialRecord } from '../../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { toast } from 'sonner';

export default function FinancialRecordsModule() {
  const { data: records = [], isLoading } = useGetAllFinancialRecords();
  const { data: summary, isLoading: summaryLoading } = useGetFinancialSummary();
  const createRecord = useCreateFinancialRecord();
  const updateRecord = useUpdateFinancialRecord();
  const deleteRecord = useDeleteFinancialRecord();

  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<FinancialRecord | null>(null);
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  const [formData, setFormData] = useState({
    transactionDetails: '',
    recordType: '',
    amount: '',
  });

  const recordTypes = ['收入', '支出', '转账', '退款', '其他'];

  const filteredRecords = records.filter(
    (record) =>
      record.transactionDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.recordType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (record?: FinancialRecord) => {
    if (record) {
      setEditingRecord(record);
      setFormData({
        transactionDetails: record.transactionDetails,
        recordType: record.recordType,
        amount: record.amount.toString(),
      });
    } else {
      setEditingRecord(null);
      setFormData({ transactionDetails: '', recordType: '', amount: '' });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.transactionDetails.trim() || !formData.recordType || !formData.amount) {
      toast.error('请填写所有字段');
      return;
    }

    const amount = parseInt(formData.amount);
    if (isNaN(amount)) {
      toast.error('请输入有效的金额');
      return;
    }

    try {
      const recordData: FinancialRecord = {
        id: editingRecord ? editingRecord.id : BigInt(Date.now()),
        transactionDetails: formData.transactionDetails.trim(),
        recordType: formData.recordType,
        amount: BigInt(amount),
      };

      if (editingRecord) {
        await updateRecord.mutateAsync(recordData);
        toast.success('财务记录已更新');
      } else {
        await createRecord.mutateAsync(recordData);
        toast.success('财务记录已创建');
      }
      setDialogOpen(false);
    } catch (error) {
      toast.error('操作失败，请重试');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteRecord.mutateAsync(deletingId);
      toast.success('财务记录已删除');
      setDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (error) {
      toast.error('删除失败，请重试');
    }
  };

  const formatAmount = (amount: bigint) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const formatBalance = (balance: bigint) => {
    const isNegative = balance < 0n;
    const absBalance = isNegative ? -balance : balance;
    return `${isNegative ? '-' : ''}¥${formatAmount(absBalance)}`;
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
          <h2 className="text-3xl font-bold">财务记录管理</h2>
          <p className="text-muted-foreground mt-1">管理财务交易和记录</p>
        </div>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          添加记录
        </Button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总收入</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  {summaryLoading ? '...' : `¥${formatAmount(summary?.totalIncome || 0n)}`}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总支出</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  {summaryLoading ? '...' : `¥${formatAmount(summary?.totalExpenses || 0n)}`}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">总余额</p>
                <p className={`text-2xl font-bold mt-2 ${
                  !summary || summary.balance >= 0n ? 'text-blue-600' : 'text-red-600'
                }`}>
                  {summaryLoading ? '...' : formatBalance(summary?.balance || 0n)}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="搜索交易详情或类型..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">暂无财务记录数据</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>交易详情</TableHead>
                    <TableHead>类型</TableHead>
                    <TableHead>金额</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id.toString()}>
                      <TableCell className="max-w-xs truncate">{record.transactionDetails}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {record.recordType}
                        </span>
                      </TableCell>
                      <TableCell className={record.recordType === '收入' ? 'text-green-600 font-medium' : record.recordType === '支出' ? 'text-red-600 font-medium' : ''}>
                        {record.recordType === '支出' ? '-' : ''}¥{formatAmount(record.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleOpenDialog(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingId(record.id);
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
            <DialogTitle>{editingRecord ? '编辑财务记录' : '添加财务记录'}</DialogTitle>
            <DialogDescription>
              {editingRecord ? '修改财务记录信息' : '填写新财务记录的详细信息'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recordType">类型</Label>
              <Select
                value={formData.recordType}
                onValueChange={(value) => setFormData({ ...formData, recordType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  {recordTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDetails">交易详情</Label>
              <Textarea
                id="transactionDetails"
                value={formData.transactionDetails}
                onChange={(e) => setFormData({ ...formData, transactionDetails: e.target.value })}
                placeholder="请输入交易详情"
                rows={4}
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
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit" disabled={createRecord.isPending || updateRecord.isPending}>
                {createRecord.isPending || updateRecord.isPending ? '保存中...' : '保存'}
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
              此操作无法撤销。确定要删除这条财务记录吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteRecord.isPending}>
              {deleteRecord.isPending ? '删除中...' : '确认删除'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
