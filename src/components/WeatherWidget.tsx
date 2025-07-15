
import React from 'react';
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Crown, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface WeatherData {
  location: string;
  temperature: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    temp: number;
    condition: 'sunny' | 'cloudy' | 'rainy' | 'snowy';
  }[];
}

const WeatherWidget = () => {
  // Données météo simulées
  const weatherData: WeatherData = {
    location: 'Paris, France',
    temperature: 22,
    condition: 'sunny',
    humidity: 65,
    windSpeed: 12,
    forecast: [
      { day: 'Demain', temp: 24, condition: 'cloudy' },
      { day: 'Mercredi', temp: 19, condition: 'rainy' },
      { day: 'Jeudi', temp: 21, condition: 'sunny' },
      { day: 'Vendredi', temp: 18, condition: 'cloudy' }
    ]
  };

  const getWeatherIcon = (condition: WeatherData['condition'], size: string = 'w-6 h-6') => {
    switch (condition) {
      case 'sunny':
        return <Sun className={`${size} text-yellow-500`} />;
      case 'cloudy':
        return <Cloud className={`${size} text-gray-500`} />;
      case 'rainy':
        return <CloudRain className={`${size} text-blue-500`} />;
      case 'snowy':
        return <CloudSnow className={`${size} text-cyan-500`} />;
      default:
        return <Sun className={`${size} text-yellow-500`} />;
    }
  };

  const getWeatherGradient = (condition: WeatherData['condition']) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 via-orange-400 to-red-400';
      case 'cloudy':
        return 'from-gray-400 via-slate-400 to-blue-400';
      case 'rainy':
        return 'from-blue-400 via-indigo-400 to-purple-400';
      case 'snowy':
        return 'from-cyan-400 via-blue-400 to-indigo-400';
      default:
        return 'from-yellow-400 via-orange-400 to-red-400';
    }
  };

  return (
    <Card className="luxury-card rounded-3xl premium-shadow-xl border-0 glow-effect overflow-hidden">
      {/* Header avec gradient météo */}
      <div className={`relative bg-gradient-to-br ${getWeatherGradient(weatherData.condition)} p-6`}>
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
        <CardHeader className="relative z-10 p-0">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold text-white mb-1">
                Météo Premium
              </CardTitle>
              <p className="text-white/90 text-sm font-medium">
                {weatherData.location}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-white" />
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
          </div>
        </CardHeader>
      </div>

      <CardContent className="p-6">
        {/* Météo actuelle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center premium-shadow">
              {getWeatherIcon(weatherData.condition, 'w-8 h-8')}
            </div>
            <div>
              <div className="text-3xl font-bold luxury-text-gradient">
                {weatherData.temperature}°C
              </div>
              <div className="text-sm text-muted-foreground font-medium capitalize">
                {weatherData.condition === 'sunny' ? 'Ensoleillé' :
                 weatherData.condition === 'cloudy' ? 'Nuageux' :
                 weatherData.condition === 'rainy' ? 'Pluvieux' : 'Neigeux'}
              </div>
            </div>
          </div>
        </div>

        {/* Détails météo */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="luxury-card rounded-xl p-3 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Thermometer className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-primary">Humidité</div>
                <div className="text-lg font-bold">{weatherData.humidity}%</div>
              </div>
            </div>
          </div>
          
          <div className="luxury-card rounded-xl p-3 border border-primary/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Wind className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <div className="text-sm font-bold text-primary">Vent</div>
                <div className="text-lg font-bold">{weatherData.windSpeed} km/h</div>
              </div>
            </div>
          </div>
        </div>

        {/* Prévisions */}
        <div>
          <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
            <Sun className="w-4 h-4" />
            Prévisions
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {weatherData.forecast.map((day, index) => (
              <div
                key={index}
                className="luxury-card rounded-xl p-3 text-center premium-hover border border-primary/10 hover:border-primary/30 transition-all duration-300"
              >
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {day.day}
                </div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition, 'w-5 h-5')}
                </div>
                <div className="text-sm font-bold text-primary">
                  {day.temp}°C
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note météo */}
        <div className="mt-4 p-3 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl border border-primary/20">
          <div className="flex items-center gap-2 text-sm">
            <Sun className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">
              Excellente journée pour vos rendez-vous extérieurs !
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherWidget;
