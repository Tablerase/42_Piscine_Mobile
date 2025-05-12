import {createContext, useContext, useState} from 'react';

export enum Page {
  Currently = 'Currently',
  Today = 'Today',
  Weekly = 'Weekly',
}

interface Position {
  name?: string;
  coords?: {
    latitude: number;
    longitude: number;
    altitude: number | null;
    accuracy: number;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp?: number;
}

interface AppState {
  page: Page;
  location: Position;
  locationPerm: boolean;
  cityField: string;
  citySearchStatus: boolean;
}

interface AppContextType extends AppState {
  setPage: (page: Page) => void;
  setLocation: (location: Position) => void;
  setLocationPerm: (granted: boolean) => void;
  setCitySearchStatus: (granted: boolean) => void;
  setCityField: (city: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({children}: {children: React.ReactNode}) => {
  const [page, setPage] = useState<Page>(Page.Currently);
  const [location, setLocation] = useState<Position>({});
  const [locationPerm, setLocationPerm] = useState<boolean>(true);
  const [citySearchStatus, setCitySearchStatus] = useState<boolean>(false);
  const [cityField, setCityField] = useState<string>('');

  return (
    <AppContext
      value={{
        page,
        setPage,
        location,
        setLocation,
        locationPerm,
        setLocationPerm,
        cityField,
        setCityField,
        citySearchStatus,
        setCitySearchStatus,
      }}>
      {children}
    </AppContext>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
