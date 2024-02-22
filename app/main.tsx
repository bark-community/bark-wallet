import React, { useEffect } from 'react';
import { useSwiper } from 'swiper/react';
import { Page, useNavigation } from './hooks/useNavigation';
import { useUser } from './hooks/useUser';
import { LoadingDot } from './loading';
import Dashboard from './pages/dashboard';
import Portfolio from './pages/portfolio';
import Transactions from './pages/transactions';
import Users from './pages/users';

interface MainPageProps {
  page: Page;
}

const MainPage: React.FC<MainPageProps> = ({ page }) => {
  const { pages, page: currentPage } = useNavigation();
  const { user } = useUser();
  const swiper = useSwiper();

  useEffect(() => {
    if (swiper && !swiper.destroyed) {
      const index = pages.findIndex((p) => p === currentPage);
      if (index !== swiper.activeIndex) {
        swiper.slideTo(index);
      }
    }
  }, [currentPage, pages, swiper]);

  const renderPage = () => {
    switch (page) {
      case Page.Dashboard:
        return <Dashboard />;
      case Page.Portfolio:
        return <Portfolio />;
      case Page.Transactions:
        return <Transactions />;
      case Page.Users:
        return <Users />;
      default:
        return <LoadingDot />;
    }
  };

  return !user || page === Page.Dashboard ? renderPage() : <LoadingDot />;
};

export default MainPage;

