import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from './components/navbar';
import Toast from './components/toast';
import { NavigationProvider } from './contexts/NavigationProvider';
import { PopupProvider } from './contexts/PopupProvider';
import { UserProvider } from './contexts/UserProvider';

export const metadata = {
  title: 'BARK Wallet',
  description: 'BARK Wallet is a secure and user-friendly wallet designed for managing BARK tokens on the Solana blockchain.',
};

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="fr">
      <body className="flex flex-col h-screen bg-tremor-background-subtle dark:bg-dark-tremor-background-subtle">
        <NavigationProvider>
          <UserProvider>
            <PopupProvider>
              <Navbar />
              {children}
              <SpeedInsights />
              <Toast />
            </PopupProvider>
          </UserProvider>
        </NavigationProvider>
      </body>
    </html>
  );
};

export default RootLayout;
