import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from './library/main';

const App = () => {
  const [selected, setSelected] = React.useState(50);

  const [count, setCount] = React.useState(100);

  const data = React.useMemo(() => {
    return new Array(count)
      .fill(0)
      .map((v, i) => ({ value: i, label: i + 'label' }));
  }, [count]);

  console.log(selected);

  return (
    <>
      <View style={{ paddingTop: 200 }}>
        <Picker
          selected={selected}
          onChange={(item) => setSelected(item.value)}
          data={data}
        />
      </View>
      <Text
        onPress={() => {
          const count = Math.floor(Math.random() * 100);
          setCount(count);
          // setSelected(Math.floor(Math.random() * count));
        }}
        style={{ fontSize: 30 }}>
        change
      </Text>
    </>
  );
};

export default App;
