import { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavigationProvider } from './providers/navigation-provider';
import { SlashAuthLoadedWrapper } from './common/components/slashauth-loader-wrapper';
import Home from './pages/home';
import { EventsPage } from './pages/events';
import { ContactPage } from './pages/contact';
import { AdminPage } from './pages/admin';
import { AppContext } from './context';
import { BeatLoader } from './common/components/spinners/beat-loader';
import { DataRoomPage } from './pages/data-room';

export const SlashAuthRoutes = () => {
  const appContext = useContext(AppContext);
  const [fetchingMetadata, setFetchingMetadata] = useState(false);

  if (
    appContext.appMetadata.data === undefined &&
    !appContext.appMetadata.loading &&
    !fetchingMetadata
  ) {
    setFetchingMetadata(true);
    appContext.appMetadata.fetch().finally(() => {
      setFetchingMetadata(false);
    });
  }

  if (appContext.roles.data === undefined) {
    appContext.roles.fetchRoles();
  }

  if (appContext.appMetadata.data === undefined) {
    // Loading state
    return <BeatLoader />;
  }

  if (appContext.appMetadata.data === null) {
    return <div>Error...</div>;
  }

  return (
    <Router>
      <NavigationProvider>
        <SlashAuthLoadedWrapper>
          <div className="sm:mr-0">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/files/*" element={<DataRoomPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin" element={<AdminPage />} />
              {/* <Route path="/create" element={<CreateApp />} />
              <Route path="/app/:appID/*" element={<SingleAppPage />} />
              <Route path="/" element={<Home />} /> */}
            </Routes>
          </div>
        </SlashAuthLoadedWrapper>
      </NavigationProvider>
    </Router>
  );
};
