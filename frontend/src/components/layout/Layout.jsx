import { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';

const Layout = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-1">
        {isAuthenticated && (
          <Sidebar />
        )}
        
        <main className={`flex-1 p-4 ${isAuthenticated ? 'md:ml-64' : ''}`}>
          <Outlet />
        </main>
      </div>
      
      <Footer />
    </div>
  );
};

export default Layout;