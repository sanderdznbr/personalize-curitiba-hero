import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Image, Users, Package, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'Banners Ativos', value: '3', icon: Image, color: 'text-blue-600' },
    { title: 'Seção Sobre', value: '1', icon: Users, color: 'text-green-600' },
    { title: 'Produtos', value: '6', icon: Package, color: 'text-purple-600' },
    { title: 'Total de Seções', value: '3', icon: BarChart3, color: 'text-orange-600' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do conteúdo do site</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/admin/banners">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                  <Image className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">Gerenciar Banners</p>
                    <p className="text-sm text-muted-foreground">Adicione ou edite banners do slider principal</p>
                  </div>
                </div>
              </Link>
              <Link to="/admin/about">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium">Seção Sobre</p>
                    <p className="text-sm text-muted-foreground">Edite o conteúdo da seção "Sobre Nós"</p>
                  </div>
                </div>
              </Link>
              <Link to="/admin/products">
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                  <Package className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="font-medium">Produtos</p>
                    <p className="text-sm text-muted-foreground">Gerencie as categorias de produtos</p>
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-2">
                <p><strong>Banners:</strong> Adicione imagens de fundo para o slider principal da homepage.</p>
                <p><strong>Sobre:</strong> Edite textos e vídeos da seção "Sobre a Personalize".</p>
                <p><strong>Produtos:</strong> Gerencie as categorias de produtos exibidas na homepage.</p>
                <p className="text-muted-foreground italic">Todas as alterações são aplicadas imediatamente no site.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};