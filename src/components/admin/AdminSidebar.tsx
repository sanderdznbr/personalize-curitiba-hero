import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Image, Users, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/banners', icon: Image, label: 'Banners/Slider' },
  { path: '/admin/about', icon: Users, label: 'Sobre Nós' },
  { path: '/admin/products', icon: Package, label: 'Produtos' },
];

export const AdminSidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-card border-r min-h-[calc(100vh-4rem)]">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};