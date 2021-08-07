import React from 'react';
import { View, Text } from 'react-native';
import { Picker } from './library/main';

const data = new Array(100)
  .fill(0)
  .map((v, i) => ({ value: i, label: i + 'label' }));

const App = () => {
  const [selected, setSelected] = React.useState(0);

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
          setSelected(Math.floor(Math.random() * 100));
        }}
        style={{ fontSize: 30 }}>
        change
      </Text>
    </>
  );
};

export default App;
