import Svg, {Circle, G, Line, Marker} from 'react-native-svg';

export const TemperatureVectorLegend = ({color}: {color: string}) => {
  return (
    <>
      <Svg width={20} height={20}>
        <G>
          <Marker>
            <Circle cx={10} cy={10} r={3} fill={color} />
          </Marker>
          <Line x1="0" y1="10" x2="20" y2="10" stroke={color} strokeWidth="2" />
        </G>
      </Svg>
    </>
  );
};
