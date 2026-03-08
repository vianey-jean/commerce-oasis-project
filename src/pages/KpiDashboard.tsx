/**
 * =============================================================================
 * KpiDashboard - Tableau de bord KPI avancé
 * =============================================================================
 * Graphiques interactifs, indicateurs clés, comparaisons mensuelles/annuelles
 */

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api/api';
import pointageApi from '@/services/api/pointageApi';
import factureApi from '@/services/api/factureApi';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, Package,
  BarChart3, PieChart as PieChartIcon, Activity, Sparkles, Calendar,
  ArrowUpRight, ArrowDownRight, Target, Zap, Crown, Eye
} from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const KpiDashboard: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const [sales, setSales] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [factures, setFactures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'month' | 'year'>('month');

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [salesRes, prodRes, clientRes, factRes] = await Promise.all([
        api.get('/api/sales'),
        api.get('/api/products'),
        api.get('/api/clients'),
        factureApi.getAll(),
      ]);
      setSales(salesRes.data || []);
      setProducts(prodRes.data || []);
      setClients(clientRes.data || []);
      setFactures(factRes.data || []);
    } catch {
      console.error('Error fetching KPI data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Calculate KPIs
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const monthlySales = sales.filter(s => {
    const d = new Date(s.date || s.createdAt);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const lastMonthSales = sales.filter(s => {
    const d = new Date(s.date || s.createdAt);
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    return d.getMonth() === lastMonth && d.getFullYear() === lastYear;
  });

  const totalRevenue = monthlySales.reduce((s, v) => s + (v.totalPrice || v.total || 0), 0);
  const lastMonthRevenue = lastMonthSales.reduce((s, v) => s + (v.totalPrice || v.total || 0), 0);
  const revenueChange = lastMonthRevenue > 0 ? ((totalRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;

  const totalProducts = products.length;
  const totalClients = clients.length;
  const totalFactures = factures.length;
  const totalStock = products.reduce((s, p) => s + (p.quantity || 0), 0);

  // Monthly sales chart data
  const monthlySalesData = months.map((m, i) => {
    const monthSales = sales.filter(s => {
      const d = new Date(s.date || s.createdAt);
      return d.getMonth() === i && d.getFullYear() === currentYear;
    });
    return {
      name: m,
      ventes: monthSales.reduce((s, v) => s + (v.totalPrice || v.total || 0), 0),
      count: monthSales.length,
    };
  });

  // Category distribution
  const categoryData = products.reduce((acc, p) => {
    const cat = p.category || p.categorie || 'Autre';
    const existing = acc.find((a: any) => a.name === cat);
    if (existing) {
      existing.value += p.quantity || 0;
    } else {
      acc.push({ name: cat, value: p.quantity || 0 });
    }
    return acc;
  }, [] as any[]);

  // Top products by sales
  const productSales = sales.reduce((acc, s) => {
    const name = s.productName || s.description || 'Inconnu';
    acc[name] = (acc[name] || 0) + (s.totalPrice || s.total || 0);
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const kpiCards = [
    { label: 'Chiffre d\'affaires', value: `${totalRevenue.toFixed(0)}€`, change: revenueChange, icon: DollarSign, gradient: 'from-violet-500 to-purple-600' },
    { label: 'Ventes du mois', value: monthlySales.length.toString(), change: lastMonthSales.length > 0 ? ((monthlySales.length - lastMonthSales.length) / lastMonthSales.length * 100) : 0, icon: ShoppingCart, gradient: 'from-cyan-500 to-blue-600' },
    { label: 'Clients', value: totalClients.toString(), change: 0, icon: Users, gradient: 'from-emerald-500 to-teal-600' },
    { label: 'Produits', value: totalProducts.toString(), change: 0, icon: Package, gradient: 'from-amber-500 to-orange-600' },
    { label: 'Factures', value: totalFactures.toString(), change: 0, icon: Target, gradient: 'from-pink-500 to-rose-600' },
    { label: 'Stock total', value: totalStock.toString(), change: 0, icon: Zap, gradient: 'from-indigo-500 to-blue-600' },
  ];

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/20 dark:from-[#030014] dark:via-[#0a0025] dark:to-[#0e0035]">
      {/* Hero */}
      <div className="relative overflow-hidden py-8 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-violet-500/5 to-purple-500/5" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                Tableau de Bord KPI <Crown className="h-4 w-4 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground">{months[currentMonth]} {currentYear} · Analyse en temps réel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
              {kpiCards.map((kpi, i) => {
                const Icon = kpi.icon;
                const isPositive = kpi.change >= 0;
                return (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="p-4 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3', kpi.gradient)}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-2xl font-black text-foreground">{kpi.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.label}</p>
                    {kpi.change !== 0 && (
                      <div className={cn('flex items-center gap-1 mt-2 text-xs font-bold',
                        isPositive ? 'text-emerald-500' : 'text-red-500')}>
                        {isPositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                        {Math.abs(kpi.change).toFixed(1)}%
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="font-black text-foreground flex items-center gap-2 mb-4">
                  <BarChart3 className="h-5 w-5 text-violet-500" /> Chiffre d'affaires mensuel
                </h3>
                <div style={{ minWidth: 0, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlySalesData}>
                      <defs>
                        <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(139,92,246,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(139,92,246,0.5)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                      <Area type="monotone" dataKey="ventes" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorVentes)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Sales Count Chart */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="font-black text-foreground flex items-center gap-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-cyan-500" /> Nombre de ventes par mois
                </h3>
                <div style={{ minWidth: 0, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(6,182,212,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(6,182,212,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(6,182,212,0.5)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)' }} />
                      <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Category Distribution */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="font-black text-foreground flex items-center gap-2 mb-4">
                  <PieChartIcon className="h-5 w-5 text-emerald-500" /> Répartition des stocks
                </h3>
                <div style={{ minWidth: 0, minHeight: 300 }}>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={categoryData.length > 0 ? categoryData : [{ name: 'Aucun', value: 1 }]}
                        cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {(categoryData.length > 0 ? categoryData : [{ name: 'Aucun', value: 1 }]).map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              {/* Top Products */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="p-5 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <h3 className="font-black text-foreground flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-amber-500" /> Top 5 Produits
                </h3>
                {topProducts.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground">
                    <Eye className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Aucune vente enregistrée</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((p, i) => {
                      const maxValue = topProducts[0]?.value || 1;
                      const percentage = (p.value / maxValue) * 100;
                      return (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-bold text-foreground truncate">{p.name}</span>
                            <span className="font-black text-foreground">{p.value.toFixed(0)}€</span>
                          </div>
                          <div className="w-full bg-white/50 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
                              className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${COLORS[i]}, ${COLORS[(i + 1) % COLORS.length]})` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (embedded) return content;
  return <Layout requireAuth>{content}</Layout>;
};

export default KpiDashboard;
