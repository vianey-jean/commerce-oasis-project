import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn, LogOut, Sun, Moon, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AuthService } from '@/services/AuthService';
import { AppointmentService, Appointment } from '@/services/AppointmentService';
import AppointmentDetails from '@/components/AppointmentDetails';

export const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Appointment[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const currentUser = AuthService.getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setIsDarkMode(storedTheme === 'dark');
      document.documentElement.classList.toggle('dark', storedTheme === 'dark');
    }
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (query.length >= 3) {
      setIsSearching(true);
      try {
        const results = await AppointmentService.search(query);
        setSearchResults(results);
        setShowSearchResults(true);
      } catch (error) {
        console.error('Erreur recherche rendez-vous:', error);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setShowSearchResults(false);
    setSearchQuery('');
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    navigate('/');
  };

  return (
    <>
      <nav className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg transition-colors duration-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-200">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Riziky-Agendas
                </h1>
              </Link>
            </div>
            
            {/* Navigation desktop */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="nav-link relative text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 group">
                Liste RDV
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/a-propos" className="nav-link relative text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 group">
                À propos
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link to="/contact" className="nav-link relative text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 group">
                Contact
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              {currentUser && (
                <Link to="/dashboard" className="nav-link relative font-bold text-purple-600 hover:text-purple-700 transition-colors duration-200 group">
                  Tableau de Bord
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-purple-600 to-pink-600"></span>
                </Link>
              )}
              
              {/* Barre de recherche modernisée */}
              <div className="relative">
                <div className="flex items-center bg-gray-50/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-2 focus-within:border-purple-400 focus-within:ring-2 focus-within:ring-purple-100 transition-all duration-200">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-0 bg-transparent focus-visible:ring-0 text-sm ml-2"
                  />
                </div>
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-2 w-96 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-4 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        onClick={() => handleAppointmentClick(result)}
                      >
                        <div className="font-medium text-gray-800">{result.titre}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {result.date} à {result.heure}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Authentification */}
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-red-800">
                      {currentUser.prenom} {currentUser.nom}
                    </div>
                    <div className="text-xs text-green-600 font-medium">Connecté</div>
                  </div>
                  <Button onClick={handleLogout} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Link to="/connexion">
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-0.5">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}

              {/* Toggle thème */}
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg hover:bg-gray-100">
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </div>
            
            {/* Menu mobile */}
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-lg">
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:text-purple-600 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Menu mobile déroulant */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
            <div className="px-4 pt-4 pb-6 space-y-4">
              <Link
                to="/"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Liste RDV
              </Link>
              <Link
                to="/a-propos"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-purple-600 hover:bg-purple-50 transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {currentUser && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-4 py-3 rounded-lg text-base font-bold text-purple-600 hover:text-purple-700 hover:bg-purple-50 transition-colors duration-200"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    tableau de Bord
                  </Link>
                  <div className="px-4 py-2 bg-green-50 rounded-lg">
                    <div className="font-bold text-green-800">
                      {currentUser.prenom} {currentUser.nom}
                    </div>
                    <div className="text-sm text-green-600">Connecté</div>
                  </div>
                </>
              )}
              
              {/* Recherche mobile */}
              <div className="relative px-4">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-transparent border-0 focus-visible:ring-0"
                  />
                </div>
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute left-4 right-4 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-3 hover:bg-purple-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                        onClick={() => handleAppointmentClick(result)}
                      >
                        <div className="font-medium text-gray-800">{result.titre}</div>
                        <div className="text-sm text-gray-500">
                          {result.date} à {result.heure}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Boutons d'action mobile */}
              {currentUser ? (
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full mx-4 border-red-200 text-red-600 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Déconnexion
                </Button>
              ) : (
                <Link to="/connexion" className="block px-4" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* ... keep existing code (AppointmentDetails modal) */}
      {selectedAppointment && (
        <AppointmentDetails
          appointment={selectedAppointment}
          open={showAppointmentDetails}
          onOpenChange={setShowAppointmentDetails}
          onEdit={() => {/* handle edit */}}
          onDelete={() => {
            setSelectedAppointment(null);
            setShowAppointmentDetails(false);
          }}
        />
      )}
    </>
  );
};

export default Navbar;
