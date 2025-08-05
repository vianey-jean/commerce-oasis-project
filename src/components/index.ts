
// Fichier d'export des composants pour faciliter les imports

// Exports de composants UI
export { Button } from './ui/button';
export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
export { Input } from './ui/input';
export { Skeleton } from './ui/skeleton';
export { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
export { ThemeToggle } from './ui/theme-toggle';

// Exports des composants personnalisés
export { default as AppointmentDetails } from './AppointmentDetails';
export { default as AppointmentForm } from './AppointmentForm';
export { default as AppointmentSelector } from './AppointmentSelector';
export { default as AutoLogout } from './AutoLogout';
export { default as Footer } from './Footer';
export { default as Navbar } from './Navbar';
export { default as WeekCalendar } from './Weekcalendar';
export { default as DashboardCalendar } from './DashboardCalendar';
export { default as PasswordStrengthIndicator } from './PasswordStrengthIndicator';
export { default as ScrollToTop } from './ScrollToTop';

// Exports des nouveaux composants dashboard
export { default as DashboardHeader } from './dashboard/DashboardHeader';
export { default as DashboardBackground } from './dashboard/DashboardBackground';
export { default as PremiumCalendarSection } from './dashboard/PremiumCalendarSection';
export { default as AppointmentModalsManager } from './dashboard/modals/AppointmentModalsManager';
