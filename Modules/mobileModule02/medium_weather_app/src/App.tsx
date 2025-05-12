// import {StrictMode} from 'react';
import {AppProvider} from '@contexts/AppContext';
import Main from '@pages/Main';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <AppProvider>
      <GestureHandlerRootView>
        <Main />
      </GestureHandlerRootView>
    </AppProvider>
  );
};

export default App;
