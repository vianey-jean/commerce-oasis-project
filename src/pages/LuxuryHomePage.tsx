import React from 'react'
import { Crown, Truck, Shield, Headphones, Star, TrendingUp } from 'lucide-react'
import HeroSection from '@/components/ecommerce/HeroSection'
import CategoryGrid from '@/components/ecommerce/CategoryGrid'
import ProductCard from '@/components/ecommerce/ProductCard'
import { LuxuryCard, LuxuryCardContent } from '@/components/ui/luxury-card'
import { LuxuryButton } from '@/components/ui/luxury-button'
import { LuxuryBadge } from '@/components/ui/luxury-badge'

// Mock data - à remplacer par des données réelles
const heroSlides = [
  {
    id: '1',
    title: 'Collection Luxe',
    subtitle: 'Perruques & Tissages Premium',
    description: 'Découvrez notre gamme exclusive de perruques et tissages de haute qualité, conçue pour sublimer votre beauté naturelle.',
    image: '/hero-slide-1.jpg',
    ctaText: 'Découvrir la Collection',
    ctaLink: '/collection-luxe',
    badge: 'Nouvelle Collection',
    isNew: true
  },
  {
    id: '2',
    title: 'Technologie Avancée',
    subtitle: 'Peignes Chauffants Professionnels',
    description: 'L\'innovation au service de votre coiffure avec nos peignes chauffants dernière génération.',
    image: '/hero-slide-2.jpg',
    ctaText: 'Voir les Produits Tech',
    ctaLink: '/tech',
    badge: 'Innovation 2024'
  }
]

const categories = [
  { id: 'perruques', name: 'Perruques', image: '/category-perruques.jpg', productCount: 127, featured: true },
  { id: 'tissages', name: 'Tissages', image: '/category-tissages.jpg', productCount: 89 },
  { id: 'queue-cheval', name: 'Queue de Cheval', image: '/category-queue.jpg', productCount: 45 },
  { id: 'peignes', name: 'Peignes Chauffants', image: '/category-peignes.jpg', productCount: 23 },
  { id: 'colles', name: 'Colles & Dissolvants', image: '/category-colles.jpg', productCount: 34 },
  { id: 'tech', name: 'Tech & Accessoires', image: '/category-tech.jpg', productCount: 56, featured: true }
]

const featuredProducts = [
  {
    id: '1',
    name: 'Perruque Lace Front Premium',
    price: 299.99,
    originalPrice: 399.99,
    image: '/product-1.jpg',
    category: 'Perruques',
    rating: 4.8,
    reviewCount: 124,
    isOnSale: true,
    discountPercentage: 25,
    stock: 12
  },
  {
    id: '2',
    name: 'Tissage Brésilien Naturel',
    price: 159.99,
    image: '/product-2.jpg',
    category: 'Tissages',
    rating: 4.9,
    reviewCount: 89,
    isNew: true,
    stock: 8
  },
  {
    id: '3',
    name: 'Peigne Chauffant Pro Max',
    price: 89.99,
    originalPrice: 129.99,
    image: '/product-3.jpg',
    category: 'Tech',
    rating: 4.7,
    reviewCount: 156,
    isHot: true,
    stock: 3
  },
  {
    id: '4',
    name: 'Queue de Cheval Luxury',
    price: 79.99,
    image: '/product-4.jpg',
    category: 'Accessoires',
    rating: 4.6,
    reviewCount: 67,
    stock: 15
  }
]

const benefits = [
  {
    icon: Truck,
    title: 'Livraison Express',
    description: 'Livraison gratuite dès 50€ d\'achat'
  },
  {
    icon: Shield,
    title: 'Garantie Qualité',
    description: 'Produits certifiés et garantis'
  },
  {
    icon: Headphones,
    title: 'Service Client 24/7',
    description: 'Support disponible à tout moment'
  },
  {
    icon: Crown,
    title: 'Programme VIP',
    description: 'Avantages exclusifs pour nos membres'
  }
]

export default function LuxuryHomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection 
        slides={heroSlides}
        autoPlay={true}
        autoPlayDelay={6000}
      />

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <LuxuryCard 
                key={index}
                variant="glass"
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <LuxuryCardContent className="p-6">
                  <div className="bg-gradient-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading font-semibold text-lg mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {benefit.description}
                  </p>
                </LuxuryCardContent>
              </LuxuryCard>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <LuxuryBadge variant="luxury" className="mb-4">
              <Star className="h-4 w-4 mr-1" />
              Nos Catégories
            </LuxuryBadge>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Explorez Nos Collections
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Découvrez notre gamme complète de produits de beauté et accessoires 
              capillaires de haute qualité.
            </p>
          </div>

          <CategoryGrid 
            categories={categories}
            onCategoryClick={(categoryId) => {
              console.log('Category clicked:', categoryId)
              // Navigation vers la catégorie
            }}
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <LuxuryBadge variant="sale" className="mb-4">
                <TrendingUp className="h-4 w-4 mr-1" />
                Tendances
              </LuxuryBadge>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Produits en Vedette
              </h2>
              <p className="text-lg text-muted-foreground">
                Nos meilleures ventes et nouveautés sélectionnées pour vous
              </p>
            </div>
            <LuxuryButton variant="outline" className="hidden md:inline-flex">
              Voir Tout
            </LuxuryButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                {...product}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
                onAddToCart={(id) => console.log('Add to cart:', id)}
                onAddToWishlist={(id) => console.log('Add to wishlist:', id)}
                onQuickView={(id) => console.log('Quick view:', id)}
                onClick={(id) => console.log('Product clicked:', id)}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <LuxuryButton variant="primary" size="lg">
              Voir Tous les Produits
            </LuxuryButton>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-luxury">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto text-white">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Restez à la Pointe de la Mode
            </h2>
            <p className="text-lg mb-8 text-white/90">
              Inscrivez-vous à notre newsletter et recevez en exclusivité nos 
              nouvelles collections et offres spéciales.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 rounded-lg border-0 bg-white/10 backdrop-blur-sm text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/30 focus:outline-none"
              />
              <LuxuryButton variant="secondary" size="lg">
                S'inscrire
              </LuxuryButton>
            </div>
            
            <p className="text-sm text-white/70 mt-4">
              * Nous respectons votre vie privée. Désabonnement possible à tout moment.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}