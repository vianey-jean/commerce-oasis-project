
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Product } from '@/types/product';

interface ProprietesDS {
  produit: Product;
  urlBase?: string;
}

const DonneesStructureesProduit: React.FC<ProprietesDS> = ({ 
  produit, 
  urlBase = window.location.origin 
}) => {
  const donneesStructurees = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": produit.name,
    "description": produit.description || produit.name,
    "image": produit.images?.map(img => `${urlBase}${img}`) || [`${urlBase}${produit.image}`],
    "brand": {
      "@type": "Brand",
      "name": "Riziky-Boutic"
    },
    "offers": {
      "@type": "Offer",
      "url": `${urlBase}/produit/${produit.id}`,
      "priceCurrency": "EUR",
      "price": produit.price,
      "priceValidUntil": produit.promotionEnd || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      "availability": produit.stock && produit.stock > 0 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "Riziky-Boutic"
      }
    } as any,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.5",
      "reviewCount": "25"
    },
    "category": produit.category,
    "sku": produit.id,
    "gtin": produit.id
  };

  if (produit.promotion && produit.promotion > 0) {
    const prixReduit = produit.price * (1 - produit.promotion / 100);
    donneesStructurees.offers = {
      ...donneesStructurees.offers,
      "price": prixReduit,
      "highPrice": produit.originalPrice || produit.price
    };
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(donneesStructurees)}
      </script>
    </Helmet>
  );
};

export default DonneesStructureesProduit;
