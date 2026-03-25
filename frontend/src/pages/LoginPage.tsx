import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">区块链CRM系统</CardTitle>
          <CardDescription className="text-base">
            基于互联网计算机的客户关系管理系统
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h3 className="font-semibold text-sm">系统功能</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 客户信息管理</li>
                <li>• 合同管理</li>
                <li>• 发票管理</li>
                <li>• 产品管理</li>
                <li>• 财务记录管理</li>
              </ul>
            </div>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              className="w-full h-12 text-base font-semibold"
              size="lg"
            >
              {isLoggingIn ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  登录中...
                </>
              ) : (
                '使用 Internet Identity 登录'
              )}
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            安全的去中心化身份验证
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
