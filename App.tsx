import React from 'react';
import { View, Text } from 'react-native';
import { DarklyText } from 'rn-darkly';
import { PickerView, Picker } from './library/main';

const App = () => {
  const [selected, setSelected] = React.useState(0);

  const [count, setCount] = React.useState(100);

  const data = React.useMemo(() => {
    return new Array(count)
      .fill(0)
      .map((v, i) => ({ value: i, label: i + 'label' }));
  }, [count]);

  console.log('selected', selected);
  return (
    <>
      <View style={{ paddingTop: 200 }}>
        <Picker
          forceDark
          // title="请选择"
          selected={selected}
          onChange={setSelected}
          data={data}>
          <DarklyText style={{ color: '#333' }} dark_style={{ color: '#ccc' }}>
            open
          </DarklyText>
        </Picker>
      </View>
      <Text
        onPress={() => {
          const count = Math.floor(Math.random() * 100);
          setCount(count);
          // setSelected(count);
        }}
        style={{ fontSize: 30 }}>
        change
      </Text>
    </>
  );
};

export default App;
