
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ProprietesSEO {
  titre?: string;
  description?: string;
  motsCles?: string;
  imageOG?: string;
  urlCanonique?: string;
  typeContenu?: string;
  datePublication?: string;
  auteur?: string;
}

const SEOHead: React.FC<ProprietesSEO> = ({
  titre = "Riziky-Boutic - Votre boutique en ligne de qualité à La Réunion",
  description = "Découvrez notre large gamme de produits de qualité avec livraison rapide à La Réunion. Mode, électronique, maison et jardin. Paiement sécurisé.",
  motsCles = "boutique en ligne, La Réunion, e-commerce, livraison rapide, mode, électronique, maison, jardin, paiement sécurisé",
  imageOG = "/images/logo-og.jpg",
  urlCanonique,
  typeContenu = "website",
  datePublication,
  auteur = "Riziky-Boutic"
}) => {
  const urlBase = window.location.origin;
  const urlComplete = urlCanonique ? `${urlBase}${urlCanonique}` : window.location.href;

  return (
    <Helmet>
      {/* Meta de base */}
      <title>{titre}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={motsCles} />
      <meta name="author" content={auteur} />
      <meta name="robots" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* URL canonique */}
      <link rel="canonical" href={urlComplete} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={typeContenu} />
      <meta property="og:url" content={urlComplete} />
      <meta property="og:title" content={titre} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${urlBase}${imageOG}`} />
      <meta property="og:site_name" content="Riziky-Boutic" />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={urlComplete} />
      <meta property="twitter:title" content={titre} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${urlBase}${imageOG}`} />
      
      {/* Schema.org pour Google */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Riziky-Boutic",
          "url": urlBase,
          "description": description,
          "potentialAction": {
            "@type": "SearchAction",
            "target": `${urlBase}/recherche?q={search_term_string}`,
            "query-input": "required name=search_term_string"
          }
        })}
      </script>
      
      {typeContenu === "product" && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": titre,
            "description": description,
            "image": `${urlBase}${imageOG}`,
            "brand": {
              "@type": "Brand",
              "name": "Riziky-Boutic"
            }
          })}
        </script>
      )}
      
      {datePublication && (
        <meta property="article:published_time" content={datePublication} />
      )}
      
      {/* Performance et sécurité */}
      <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
      <meta httpEquiv="X-Frame-Options" content="DENY" />
      <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
    </Helmet>
  );
};

export default SEOHead;
