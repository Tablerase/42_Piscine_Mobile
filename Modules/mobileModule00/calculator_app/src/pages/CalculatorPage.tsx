import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import AppBar from '@components/appBar';
import {useEffect, useState} from 'react';
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
          action={button.action}
          color={button.color}
        />
      ))}
    </View>
  );
};

interface CalculatorProps {
  buttons: CalculatorButtonData[];
}

const Calculator = ({buttons}: CalculatorProps) => {
  // Dynamically split buttons into rows of 5 each
  const rows = [];
  const buttonsPerRow = 5;

  for (let i = 0; i < buttons.length; i += buttonsPerRow) {
    const row = buttons.slice(i, i + buttonsPerRow);
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
  const [value, setValue] = useState<number>(0);

  const handleNumberPress = (number: string) => {
    if (expression === '0') {
      setExpression(number);
    } else {
      setExpression(prev => prev + number);
    }
    safeEvaluate(expression);
  };

  const handleDecimalPress = (decimal: string) => {
    if (!expression.includes('.')) {
      setExpression(prev => prev + decimal);
    }
  };

  // Safely evaluate a mathematical expression
  // TODO: Handling of negative numbers
  const safeEvaluate = (expr: string): number => {
    // Convert expression to number if it's just a number
    if (!isNaN(Number(expr))) {
      return Number(expr);
    }

    // Parse and evaluate the expression safely
    try {
      // Split the expression by operators and parse
      const parts = expr.match(/(\d+\.?\d*|\.\d+|[-+*/])/g) || [];
      console.log('Parsed parts:', parts);
      if (parts.length === 0) {
        return 0;
      }

      // Process multiplication and division first
      let i = 1;
      while (i < parts.length) {
        if (parts[i] === '*' || parts[i] === '/') {
          const left = parseFloat(parts[i - 1]);
          const right = parseFloat(parts[i + 1]);
          const result = parts[i] === '*' ? left * right : left / right;
          parts.splice(i - 1, 3, result.toString());
        } else {
          i += 2;
        }
      }

      // Process addition and subtraction
      let result = parseFloat(parts[0]);
      for (i = 1; i < parts.length; i += 2) {
        const operator = parts[i];
        const valueOp = parseFloat(parts[i + 1]);
        if (operator === '+') {
          result += valueOp;
        } else if (operator === '-') {
          result -= valueOp;
        }
      }

      return result;
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return 0;
    }
  };

  const handleOperator = (op: string) => {
    if (expression !== '0') {
      setExpression(prev => prev + op);
    }
  };

  useEffect(() => {
    const currentExpression = expression;
    const currentResult = safeEvaluate(currentExpression);
    setValue(currentResult);
  }, [expression]);

  const calculatorButtons: CalculatorButtonData[] = [
    {label: '7', action: () => handleNumberPress('7')},
    {label: '8', action: () => handleNumberPress('8')},
    {label: '9', action: () => handleNumberPress('9')},
    {
      label: 'C',
      action: () =>
        setExpression(expression.slice(0, -1) ? expression.slice(0, -1) : '0'),
      color: 'red',
    },
    {
      label: 'AC',
      action: () => {
        setExpression('0');
        setValue(0);
      },
      color: 'red',
    },
    {label: '4', action: () => handleNumberPress('4')},
    {label: '5', action: () => handleNumberPress('5')},
    {label: '6', action: () => handleNumberPress('6')},
    {label: '+', action: () => handleOperator('+'), color: 'white'},
    {label: '-', action: () => handleOperator('-'), color: 'white'},
    {label: '1', action: () => handleNumberPress('1')},
    {label: '2', action: () => handleNumberPress('2')},
    {label: '3', action: () => handleNumberPress('3')},
    {label: '*', action: () => handleOperator('*'), color: 'white'},
    {label: '/', action: () => handleOperator('/'), color: 'white'},
    {label: '0', action: () => handleNumberPress('0')},
    {label: '.', action: () => handleDecimalPress('.')},
    {label: '00', action: () => handleNumberPress('00')},
    {
      label: '=',
      action: () => {
        console.log('Result:', value);
      },
      color: 'white',
    },
  ];
  return (
    <View style={styles.calculatorPage}>
      <AppBar title="Calculator" />
      <Text style={styles.textDisplay}>{expression}</Text>
      <Text style={styles.textDisplay}>{value}</Text>
      <Calculator buttons={calculatorButtons} />
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
    fontSize: 30,
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
    padding: 15,
    width: '20%',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default CalculatorPage;
