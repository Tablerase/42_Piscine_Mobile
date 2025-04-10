import CalculatorPage from '@pages/CalculatorPage';
import {StrictMode} from 'react';

function Main() {
  return (
    <>
      <CalculatorPage />
    </>
  );
}

const App = () => {
  return (
    <StrictMode>
      <Main />
    </StrictMode>
  );
};

export default App;
