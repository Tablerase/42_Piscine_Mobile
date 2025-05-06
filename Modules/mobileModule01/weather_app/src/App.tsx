import {StrictMode} from 'react';
import Main from '@pages/Main';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <StrictMode>
      <GestureHandlerRootView>
        <Main />
      </GestureHandlerRootView>
    </StrictMode>
  );
};

export default App;
