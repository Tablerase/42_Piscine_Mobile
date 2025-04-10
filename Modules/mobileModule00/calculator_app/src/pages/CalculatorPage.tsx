import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AppBar from '@components/appBar';
import {useState} from 'react';
import globalStyles from '@styles/GlobalStyles';

interface CalculatorButtonData {
  label?: string;
  action?: () => void;
  color?: string;
}

interface CalculatorButtonProps {
  label?: string;
  action?: () => void;
  color?: string;
}

interface CalculatorRowProps {
  buttons: CalculatorButtonData[];
}

const CalculatorButtons: CalculatorButtonData[] = [
  {label: '7', action: () => {}},
  {label: '8', action: () => {}},
  {label: '9', action: () => {}},
  {label: 'C', action: () => {}, color: 'red'},
  {label: 'AC', action: () => {}, color: 'red'},
  {label: '4', action: () => {}},
  {label: '5', action: () => {}},
  {label: '6', action: () => {}},
  {label: '+', action: () => {}, color: 'white'},
  {label: '-', action: () => {}, color: 'white'},
  {label: '1', action: () => {}},
  {label: '2', action: () => {}},
  {label: '3', action: () => {}},
  {label: '*', action: () => {}, color: 'white'},
  {label: '/', action: () => {}, color: 'white'},
  {label: '0', action: () => {}},
  {label: '.', action: () => {}},
  {label: '00', action: () => {}},
  {label: '=', action: () => {}, color: 'white'},
];

const CalculatorButton = ({label, action, color}: CalculatorButtonProps) => {
  // If the button is empty, return null
  if (!label) {
    return <View style={styles.button} />;
  }

  return (
    <TouchableOpacity style={styles.button} onPress={action}>
      <Text style={[styles.buttonText, color ? {color} : {}]}>{label}</Text>
    </TouchableOpacity>
  );
};
const CalculatorRow = ({buttons}: CalculatorRowProps) => {
  return (
    <View style={styles.row}>
      {buttons.map((button, index) => (
        <CalculatorButton
          key={index}
          label={button.label}
          action={() => {
            console.log('Button pressed:', button.label);
          }}
          color={button.color}
        />
      ))}
    </View>
  );
};

const Calculator = () => {
  // Dynamically split buttons into rows of 5 each
  const rows = [];
  const buttonsPerRow = 5;

  for (let i = 0; i < CalculatorButtons.length; i += buttonsPerRow) {
    const row = CalculatorButtons.slice(i, i + buttonsPerRow);
    // If the last row is not full, pad with empty objects
    while (row.length < buttonsPerRow) {
      row.push({});
    }
    rows.push(row);
  }

  return (
    <View style={styles.calculator}>
      {rows.map((row, index) => (
        <CalculatorRow key={index} buttons={row} />
      ))}
    </View>
  );
};

const CalculatorPage = () => {
  const [expression, setExpression] = useState<string>('0');
  const [result, setResult] = useState<number>(0);

  return (
    <View style={styles.calculatorPage}>
      <AppBar title="Calculator" />
      <Text style={styles.textDisplay}>{expression}</Text>
      <Text style={styles.textDisplay}>{result}</Text>
      <Calculator />
    </View>
  );
};

const styles = StyleSheet.create({
  calculatorPage: {
    backgroundColor: globalStyles.container.backgroundColor,
    flex: 1,
    justifyContent: 'space-between',
  },
  textDisplay: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  calculator: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    backgroundColor: '#ccc',
    padding: 20,
    width: '20%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CalculatorPage;
