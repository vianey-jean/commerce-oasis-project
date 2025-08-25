import React, { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react'
import { LuxuryButton } from '@/components/ui/luxury-button'
import { LuxuryBadge } from '@/components/ui/luxury-badge'
import { cn } from '@/lib/utils'

interface HeroSlide {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  badge?: string
  isNew?: boolean
}

interface HeroSectionProps {
  slides: HeroSlide[]
  autoPlay?: boolean
  autoPlayDelay?: number
  className?: string
  onSlideClick?: (slide: HeroSlide) => void
}

export default function HeroSection({
  slides,
  autoPlay = true,
  autoPlayDelay = 5000,
  className,
  onSlideClick
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay)

  useEffect(() => {
    if (!isAutoPlaying || slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayDelay)

    return () => clearInterval(interval)
  }, [isAutoPlaying, slides.length, autoPlayDelay])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
  }

  if (slides.length === 0) return null

  const currentSlideData = slides[currentSlide]

  return (
    <section className={cn("relative h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden", className)}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={cn(
              "absolute inset-0 transition-all duration-1000 ease-in-out",
              index === currentSlide 
                ? "opacity-100 scale-100" 
                : "opacity-0 scale-105"
            )}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = '/placeholder-hero.jpg'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl text-white">
            {/* Badge */}
            {currentSlideData.badge && (
              <div className="mb-4 animate-fade-in">
                <LuxuryBadge 
                  variant={currentSlideData.isNew ? "new" : "luxury"} 
                  className="text-sm px-4 py-2"
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  {currentSlideData.badge}
                </LuxuryBadge>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 animate-fade-in-up">
              <span className="text-gradient">
                {currentSlideData.title}
              </span>
            </h1>

            {/* Subtitle */}
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-4 text-secondary animate-fade-in-up" 
                style={{ animationDelay: '200ms' }}>
              {currentSlideData.subtitle}
            </h2>

            {/* Description */}
            <p className="text-lg text-white/90 mb-8 max-w-lg animate-fade-in-up" 
               style={{ animationDelay: '400ms' }}>
              {currentSlideData.description}
            </p>

            {/* CTA Button */}
            <div className="animate-fade-in-up" style={{ animationDelay: '600ms' }}>
              <LuxuryButton
                variant="luxury"
                size="xl"
                onClick={() => onSlideClick?.(currentSlideData)}
                className="group"
              >
                <ShoppingBag className="h-5 w-5 mr-2 group-hover:animate-bounce-subtle" />
                {currentSlideData.ctaText}
              </LuxuryButton>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/50 hover:bg-white/75"
              )}
            />
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-gradient-primary transition-all duration-300"
            style={{
              width: `${((currentSlide + 1) / slides.length) * 100}%`
            }}
          />
        </div>
      )}
    </section>
  )
}