import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CartDrawer from '../common/CartDrawer';
import MobileMenu from './MobileMenu';
import SearchOverlay from '../common/SearchOverlay';

const Layout = ({ children }) => {
  const location = useLocation();
  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideStoreShell = isAuthPage || isAdminPage;

  return (
    <div className="min-h-screen flex flex-col">
      {!hideStoreShell && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!hideStoreShell && <Footer />}
      {!hideStoreShell && <CartDrawer />}
      {!hideStoreShell && <MobileMenu />}
      {!hideStoreShell && <SearchOverlay />}
    </div>
  );
};

export default Layout;
