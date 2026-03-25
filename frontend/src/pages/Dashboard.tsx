import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Receipt, Package, DollarSign, LogOut, Menu, X } from 'lucide-react';
import CustomersModule from '../components/modules/CustomersModule';
import ContractsModule from '../components/modules/ContractsModule';
import InvoicesModule from '../components/modules/InvoicesModule';
import ProductsModule from '../components/modules/ProductsModule';
import FinancialRecordsModule from '../components/modules/FinancialRecordsModule';

type ModuleType = 'home' | 'customers' | 'contracts' | 'invoices' | 'products' | 'financial';

export default function Dashboard() {
  const [activeModule, setActiveModule] = useState<ModuleType>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { clear } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const modules = [
    { id: 'customers' as ModuleType, name: '客户管理', icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'contracts' as ModuleType, name: '合同管理', icon: FileText, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'invoices' as ModuleType, name: '发票管理', icon: Receipt, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { id: 'products' as ModuleType, name: '产品管理', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'financial' as ModuleType, name: '财务记录', icon: DollarSign, color: 'text-red-600', bgColor: 'bg-red-50' },
  ];

  const renderModule = () => {
    switch (activeModule) {
      case 'customers':
        return <CustomersModule />;
      case 'contracts':
        return <ContractsModule />;
      case 'invoices':
        return <InvoicesModule />;
      case 'products':
        return <ProductsModule />;
      case 'financial':
        return <FinancialRecordsModule />;
      default:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
              <h2 className="text-3xl font-bold mb-2">欢迎回来，{userProfile?.name}</h2>
              <p className="text-blue-100">区块链客户关系管理系统</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Card
                    key={module.id}
                    className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                    onClick={() => setActiveModule(module.id)}
                  >
                    <CardHeader>
                      <div className={`w-12 h-12 ${module.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                        <Icon className={`w-6 h-6 ${module.color}`} />
                      </div>
                      <CardTitle className="text-xl">{module.name}</CardTitle>
                      <CardDescription>管理和查看{module.name.replace('管理', '')}信息</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">区块链CRM系统</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:inline">
                {userProfile?.name}
              </span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-200 ease-in-out mt-16 lg:mt-0`}
        >
          <nav className="p-4 space-y-2">
            <Button
              variant={activeModule === 'home' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => {
                setActiveModule('home');
                setSidebarOpen(false);
              }}
            >
              <Menu className="h-4 w-4 mr-3" />
              首页
            </Button>
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Button
                  key={module.id}
                  variant={activeModule === module.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => {
                    setActiveModule(module.id);
                    setSidebarOpen(false);
                  }}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {module.name}
                </Button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {renderModule()}
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2025. Built with ❤️ using{' '}
          <a href="https://caffeine.ai" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
