/**
 * =============================================================================
 * StocksPage - Module de Gestion des Stocks Avancé
 * =============================================================================
 * Suivi des entrées/sorties, alertes stock bas, historique mouvements
 */

import React, { useState, useEffect, useCallback } from 'react';
import Layout from '@/components/Layout';
import { useToast } from '@/hooks/use-toast';
import stockApi, { StockMovement, LowStockProduct } from '@/services/api/stockApi';
import api from '@/services/api/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Package, Plus, ArrowDown, ArrowUp, AlertTriangle, Search,
  Sparkles, BarChart3, Archive, Boxes, TrendingDown, TrendingUp, RefreshCw
} from 'lucide-react';

interface Product {
  id: string;
  description: string;
  quantity: number;
  purchasePrice: number;
  sellingPrice?: number;
}

const StocksPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [threshold, setThreshold] = useState(5);

  const [form, setForm] = useState({
    productId: '',
    type: 'entree' as 'entree' | 'sortie',
    quantity: '',
    raison: '',
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, movRes, lowRes] = await Promise.all([
        api.get<Product[]>('/api/products'),
        stockApi.getAll(),
        stockApi.getLowStock(threshold),
      ]);
      setProducts(prodRes.data);
      setMovements(movRes.data);
      setLowStock(lowRes.data);
    } catch {
      console.error('Error fetching stocks');
    } finally {
      setLoading(false);
    }
  }, [threshold]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async () => {
    if (!form.productId || !form.quantity) {
      toast({ title: 'Erreur', description: 'Produit et quantité requis', variant: 'destructive' });
      return;
    }
    try {
      await stockApi.create({
        productId: form.productId,
        type: form.type,
        quantity: parseInt(form.quantity),
        raison: form.raison,
      });
      toast({ title: `✅ ${form.type === 'entree' ? 'Entrée' : 'Sortie'} enregistrée` });
      setForm({ productId: '', type: 'entree', quantity: '', raison: '' });
      setShowForm(false);
      fetchData();
    } catch {
      toast({ title: 'Erreur', variant: 'destructive' });
    }
  };

  const filteredProducts = products.filter(p =>
    !search || p.description.toLowerCase().includes(search.toLowerCase())
  );

  const totalItems = products.reduce((s, p) => s + (p.quantity || 0), 0);
  const totalValue = products.reduce((s, p) => s + ((p.quantity || 0) * (p.purchasePrice || 0)), 0);

  const content = (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 dark:from-[#030014] dark:via-[#001a0a] dark:to-[#002015]">
      {/* Hero */}
      <div className="relative overflow-hidden py-8 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 dark:bg-white/5 backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Boxes className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                Gestion des Stocks <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              </h2>
              <p className="text-xs text-muted-foreground">{products.length} produits · {totalItems} articles</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-6">
            {[
              { label: 'Produits', value: products.length, icon: Package, gradient: 'from-emerald-500 to-teal-600' },
              { label: 'Articles totaux', value: totalItems, icon: Archive, gradient: 'from-blue-500 to-cyan-600' },
              { label: 'Valeur stock', value: `${totalValue.toFixed(0)}€`, icon: BarChart3, gradient: 'from-amber-500 to-orange-600' },
              { label: 'Alertes stock', value: lowStock.length, icon: AlertTriangle, gradient: lowStock.length > 0 ? 'from-red-500 to-rose-600' : 'from-green-500 to-emerald-600' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="p-3 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-lg">
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center mb-2 mx-auto', s.gradient)}>
                  <s.icon className="h-4 w-4 text-white" />
                </div>
                <p className="text-lg font-black text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl shadow-2xl p-5 border border-white/25 max-w-xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none" />
            <div className="relative flex flex-wrap justify-center gap-3">
              <Button onClick={() => { setForm({ ...form, type: 'entree' }); setShowForm(true); }}
                className="bg-gradient-to-br from-green-500 to-emerald-700 border border-green-300/40 text-white shadow-lg hover:shadow-xl rounded-2xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105">
                <ArrowDown className="h-4 w-4 mr-2" /> Entrée Stock
              </Button>
              <Button onClick={() => { setForm({ ...form, type: 'sortie' }); setShowForm(true); }}
                className="bg-gradient-to-br from-orange-500 to-red-700 border border-orange-300/40 text-white shadow-lg hover:shadow-xl rounded-2xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105">
                <ArrowUp className="h-4 w-4 mr-2" /> Sortie Stock
              </Button>
              <Button onClick={fetchData}
                className="bg-gradient-to-br from-cyan-500 to-blue-700 border border-cyan-300/40 text-white shadow-lg hover:shadow-xl rounded-2xl px-5 py-2.5 font-bold text-sm transition-all hover:scale-105">
                <RefreshCw className="h-4 w-4 mr-2" /> Actualiser
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12">
        {/* Low stock alerts */}
        {lowStock.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/30">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-red-500 animate-pulse" />
              <h3 className="font-black text-red-600 dark:text-red-400">Alertes Stock Bas ({lowStock.length})</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {lowStock.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-white/5">
                  <span className="text-sm font-bold truncate">{p.description}</span>
                  <Badge className="bg-red-500/20 text-red-600 text-xs">{p.quantity} restants</Badge>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Rechercher un produit..." value={search} onChange={e => setSearch(e.target.value)}
            className="pl-10 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border-white/20" />
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((p, i) => {
              const isLow = p.quantity <= threshold;
              return (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    'p-4 rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border shadow-lg hover:shadow-xl transition-all',
                    isLow ? 'border-red-300/50 dark:border-red-800/50' : 'border-white/20 dark:border-white/10'
                  )}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shadow-lg',
                        isLow ? 'bg-gradient-to-br from-red-500 to-rose-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600')}>
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{p.description}</p>
                        <p className="text-xs text-muted-foreground">{p.purchasePrice?.toFixed(2)}€/unité</p>
                      </div>
                    </div>
                    {isLow && <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse flex-shrink-0" />}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-foreground">{p.quantity}</p>
                      <p className="text-xs text-muted-foreground">en stock</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{((p.quantity || 0) * (p.purchasePrice || 0)).toFixed(2)}€</p>
                      <p className="text-xs text-muted-foreground">valeur</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Recent movements */}
        {movements.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-black text-foreground mb-4 flex items-center gap-2">
              <RefreshCw className="h-5 w-5 text-emerald-500" /> Mouvements récents
            </h3>
            <div className="space-y-2">
              {movements.slice(0, 20).map((m, i) => {
                const product = products.find(p => p.id === m.productId);
                return (
                  <div key={m.id} className="flex items-center justify-between p-3 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20">
                    <div className="flex items-center gap-2">
                      {m.type === 'entree'
                        ? <TrendingUp className="h-4 w-4 text-green-500" />
                        : <TrendingDown className="h-4 w-4 text-red-500" />}
                      <div>
                        <p className="text-sm font-bold">{product?.description || m.productId}</p>
                        <p className="text-xs text-muted-foreground">{m.raison || 'Aucune raison'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={cn('text-xs', m.type === 'entree' ? 'bg-green-500/20 text-green-600' : 'bg-red-500/20 text-red-600')}>
                        {m.type === 'entree' ? '+' : '-'}{m.quantity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(m.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-md rounded-3xl bg-white/95 dark:bg-[#0a0020]/95 backdrop-blur-2xl border border-emerald-200/30 dark:border-emerald-800/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-black">
              {form.type === 'entree'
                ? <><ArrowDown className="h-5 w-5 text-green-500" /> Entrée de Stock</>
                : <><ArrowUp className="h-5 w-5 text-red-500" /> Sortie de Stock</>}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Produit *</label>
              <select value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-white dark:bg-white/10 border border-white/20 text-sm">
                <option value="">-- Sélectionner --</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.description} (Stock: {p.quantity})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Quantité *</label>
              <Input type="number" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                placeholder="Quantité" className="rounded-xl" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Raison</label>
              <Input value={form.raison} onChange={e => setForm({ ...form, raison: e.target.value })}
                placeholder="Raison du mouvement" className="rounded-xl" />
            </div>
            <Button onClick={handleSubmit}
              className={cn('w-full rounded-xl text-white font-bold py-3',
                form.type === 'entree' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-orange-500 to-red-600')}>
              Enregistrer {form.type === 'entree' ? "l'entrée" : 'la sortie'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );

  if (embedded) return content;
  return <Layout requireAuth>{content}</Layout>;
};

export default StocksPage;
