import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-brand-dark-blue text-white py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 QuizMAX. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
