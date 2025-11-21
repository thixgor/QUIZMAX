import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Home, PlusCircle, List } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-brand-dark-blue text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              {/* Placeholder para logo - substitua quando tiver o SVG */}
              <span className="text-brand-dark-blue font-bold text-xl">QM</span>
            </div>
            <span className="text-2xl font-bold">QuizMAX</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="flex items-center space-x-1 hover:text-brand-orange transition-colors"
            >
              <Home size={20} />
              <span>Início</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/create"
                  className="flex items-center space-x-1 hover:text-brand-orange transition-colors"
                >
                  <PlusCircle size={20} />
                  <span>Criar Quiz</span>
                </Link>

                <Link
                  to="/my-quizzes"
                  className="flex items-center space-x-1 hover:text-brand-orange transition-colors"
                >
                  <List size={20} />
                  <span>Meus Quizzes</span>
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 ml-4 border-l border-brand-light-blue pl-4">
                <div className="flex items-center space-x-2">
                  <User size={20} />
                  <span className="font-medium">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-brand-orange hover:bg-orange-600 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut size={20} />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 ml-4">
                <Link
                  to="/login"
                  className="bg-brand-light-blue hover:bg-opacity-90 px-4 py-2 rounded-lg transition-colors"
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="bg-brand-orange hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
                >
                  Cadastrar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
