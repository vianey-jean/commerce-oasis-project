
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFoundPage = () => {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4">
      <h1 className="text-5xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
      <p className="text-gray-600 text-center max-w-md mb-8">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/">
        <Button>Retour à l'accueil</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
