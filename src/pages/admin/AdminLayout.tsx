
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingBag,
  Package,
  MessageCircle,
  Users,
  Truck,
  Settings,
  LogOut,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';
import _ from 'lodash';

interface AdminLayoutProps {
  children: React.ReactNode;
}

interface AdminNotifications {
  messages: number;
  commandes: number;
  chat: number;
  serviceClient: number;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  const [isServiceAdmin, setIsServiceAdmin] = useState(false);
  const [notifications, setNotifications] = useState<AdminNotifications>({
    messages: 0,
    commandes: 0,
    chat: 0,
    serviceClient: 0
  });
  const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  
  useEffect(() => {
    // Check if the current user is a service client admin
    if (user && user.email === "service.client@example.com") {
      setIsServiceAdmin(true);
    }
  }, [user]);

  // Fonction pour récupérer les notifications avec gestion optimisée des erreurs
  const fetchNotifications = useCallback(async () => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      const response = await axios.get(`${AUTH_BASE_URL}/api/notifcommandes/admin`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des notifications:", error);
      // Silent error
    }
  }, [user, AUTH_BASE_URL]);
  
  // Mark notifications as read when navigating to that section
  const markAsRead = useCallback(async (section: string) => {
    if (!user || user.role !== 'admin') return;
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;
      
      await axios.post(`${AUTH_BASE_URL}/api/notifcommandes/admin/${section}/read`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(prev => ({
        ...prev,
        [section]: 0
      }));
    } catch (error) {
      console.error(`Erreur lors du marquage des notifications ${section} comme lues:`, error);
      // Silent error
    }
  }, [user, AUTH_BASE_URL]);
  
  // Effet pour vérifier les notifications en fonction du pathname
  useEffect(() => {
    if (location.pathname === '/admin/messages' && notifications.messages > 0) {
      markAsRead('messages');
    } else if (location.pathname === '/admin/commandes' && notifications.commandes > 0) {
      markAsRead('commandes');
    } else if (location.pathname === '/admin' && notifications.chat > 0) {
      markAsRead('chat');
    } else if (location.pathname === '/admin/service-client' && notifications.serviceClient > 0) {
      markAsRead('serviceClient');
    }
  }, [location.pathname, notifications, markAsRead]);
  
  // Effet pour mettre en place une vérification périodique des notifications
  useEffect(() => {
    // Vérifier immédiatement
    fetchNotifications();
    
    // Puis vérifier périodiquement
    const intervalId = setInterval(fetchNotifications, 5000); // Check every 5 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);
  
  const navItems = [
    { name: 'Produits', path: '/admin/produits', icon: Package, notification: 0 },
    { name: 'Utilisateurs', path: '/admin/utilisateurs', icon: Users, notification: 0 },
    { name: 'Messages', path: '/admin/messages', icon: MessageCircle, notification: notifications.messages },
    { name: 'Commandes', path: '/admin/commandes', icon: Truck, notification: notifications.commandes },
    { name: 'Chat Admin', path: '/admin', icon: ShoppingBag, notification: notifications.chat },
    // Conditional item for service client admin
    ...(isServiceAdmin ? [{ 
      name: 'Service Client', 
      path: '/admin/service-client', 
      icon: MessageSquare,
      notification: notifications.serviceClient
    }] : []),
    { name: 'Paramètres', path: '/admin/parametres', icon: Settings, notification: 0 },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-gray-900 text-white md:min-h-screen">
        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-gray-900 text-white flex justify-between items-center">
          <span className="font-bold text-lg">Admin Dashboard</span>
          <button className="focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        
        {/* Sidebar Content */}
        <div className="p-4">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">Riziky-Boutic</h1>
            <p className="text-gray-400 text-sm">Administration</p>
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item, idx) => (
              <Link
                key={`${item.path}-${idx}`}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-red-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                } relative`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span>{item.name}</span>
                {item.notification > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {item.notification}
                  </Badge>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-8 border-t border-gray-700 mt-8">
            <Link to="/" className="flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors">
              <LogOut className="h-5 w-5 mr-3" />
              Quitter
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
