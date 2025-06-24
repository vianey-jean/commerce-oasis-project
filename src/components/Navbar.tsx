import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, LogIn, LogOut, Sun, Moon } from 'lucide-react';
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
      <nav className="bg-background border-b transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center">
                <h1 className="text-xl font-bold text-foreground text-primary">Riziky-Agendas</h1>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="nav-link text-foreground hover:text-primary">Liste RDV</Link>
              <Link to="/a-propos" className="nav-link text-foreground hover:text-primary">À propos</Link>
              <Link to="/contact" className="nav-link text-foreground hover:text-primary">Contact</Link>
              {currentUser && (
                <Link to="/dashboard" className="nav-link font-bold text-primary">Prise RDV</Link>
              )}
              
              <div className="relative">
                <div className="flex items-center border rounded-md px-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border-0 focus-visible:ring-0 bg-background"
                  />
                </div>
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full mt-1 w-96 bg-background border rounded-md shadow-lg z-50">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-2 hover:bg-accent cursor-pointer"
                        onClick={() => handleAppointmentClick(result)}
                      >
                        <div className="font-medium text-foreground">{result.titre}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.date} à {result.heure}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {currentUser ? (
                <div className="flex items-center space-x-4">
                  <span className="text-foreground text-green-600 font-bold">
                    {currentUser.prenom} {currentUser.nom}
                  </span>
                  <Button onClick={handleLogout} variant="outline">
                    <LogOut className="h-4 w-4 mr-2 " />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <Link to="/connexion">
                  <Button>
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}

              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
            </div>
            
            <div className="md:hidden flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-700" />
                )}
              </Button>
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary focus:outline-none"
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
        
        {isMenuOpen && (
          <div className="md:hidden bg-background">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Liste RDV
              </Link>
              <Link
                to="/a-propos"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                À propos
              </Link>
              <Link
                to="/contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {currentUser && (
                <>
                  <Link
                    to="/dashboard"
                    className="block px-3 py-2 rounded-md text-base font-bold text-primary hover:text-primary/80"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Prise RDV
                  </Link>
                  <div className=" block px-3 py-2 font-bold text-primary " >
                    {currentUser.prenom} {currentUser.nom}
                  </div>
                </>
              )}
              
              <div className="relative px-3 py-2">
                <div className="flex items-center border rounded-md px-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="bg-background"
                  />
                </div>
                
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute left-3 right-3 mt-1 bg-background border rounded-md shadow-lg z-10">
                    {searchResults.map((result) => (
                      <div
                        key={result.id}
                        className="p-2 hover:bg-accent cursor-pointer"
                        onClick={() => handleAppointmentClick(result)}
                      >
                        <div className="font-medium text-foreground">{result.titre}</div>
                        <div className="text-sm text-muted-foreground">
                          {result.date} à {result.heure}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              {currentUser ? (
                <Button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2 text-primary" />
                  Déconnexion
                </Button>
              ) : (
                <Link to="/connexion" className="block w-full" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">
                    <LogIn className="h-4 w-4 mr-2" />
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
      
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