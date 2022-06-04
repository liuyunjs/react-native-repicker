# react-native-repicker

## 安装

### yarn
```shell
yarn add react-native-repicker react-native-linear-gradient react-native-reanimated react-native-gesture-handler
```
### npm
```shell
npm install react-native-repicker react-native-linear-gradient react-native-reanimated react-native-gesture-handler --save
```

## PickerView 示例
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { DarklyText } from 'rn-darkly';
import { Picker } from 'react-native-repicker';

const App = () => {
    const [selected, setSelected] = React.useState(50);

    const [count, setCount] = React.useState(100);

    const data = React.useMemo(() => {
        return new Array(count)
            .fill(0)
            .map((v, i) => ({ value: i, label: i + 'label' }));
    }, [count]);

    return (
        <>
            <View style={{ paddingTop: 200 }}>
                <Picker
                    selected={selected}
                    onChange={setSelected}
                    data={data}
                />
            </View>
            <Text
                onPress={() => {
                    const count = Math.floor(Math.random() * 100);
                    // setCount(count);
                    setSelected(count);
                }}
                style={{ fontSize: 30 }}>
                change
            </Text>
        </>
    );
};

export default App;
```

## Picker Modal 示例
```javascript
import React from 'react';
import { View, Text } from 'react-native';
import { DarklyText } from 'rn-darkly';
import { Picker } from 'react-native-repicker';

const App = () => {
    const [selected, setSelected] = React.useState(50);

    const [count, setCount] = React.useState(100);

    const data = React.useMemo(() => {
        return new Array(count)
            .fill(0)
            .map((v, i) => ({ value: i, label: i + 'label' }));
    }, [count]);

    return (
        <>
            <View style={{ paddingTop: 200 }}>
                <Picker
                    title="请选择"
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
                    // setCount(count);
                    setSelected(count);
                }}
                style={{ fontSize: 30 }}>
                change
            </Text>
        </>
    );
};

export default App;
```


## Props

### PickerView

#### data: {value: string | number, label: string | number}[];
用于选择器的数据;

#### onChange?: (selected:  number) => void;
选中某一条数据时触发;

#### selected?: number;
指定选中某一条数据的下标;

#### itemHeight?: number;
选择器中的行高， 默认为 36;

#### itemTotal?: number;
可见区域内，展示几行，应该大于等于3，并且是单数，默认为 7;

#### itemFontSize?: number;
文字字号，默认为 16;

#### itemColor?: string;
文字颜色，默认为 #333;

#### indicatorColor?: string;
细横线的颜色，默认为 #666;

#### overlayColor?: string;
遮罩的颜色， 默认为 #fff;


> 以下需要 useColorScheme Api 的支持

#### dark_itemColor?: string;
暗黑模式下, 文字的颜色, 默认为 #eee;

#### dark_indicatorColor?: string;
暗黑模式下, 细横线的颜色，默认为 #ccc;

#### dark_overlayColor?: string;
暗黑模式下, 遮罩的颜色， 默认为 #000;


### Picker Modal

#### children?: React.ReactElement
- 如果 children 传入了一个子组件，就会启用模态框
- **children 组件应该实现了 onPress**


#### cancelText?: string;
取消按钮显示的文字

#### onCancel?: () => void;
点击取消按钮调用的回调

#### confirmText?: string;

确定按钮显示的文字
#### onConfirm?: () => void;

点击确定按钮调用的回调
#### tintColor?: string;
确定按钮高亮的颜色，默认为 #1073ea

#### title?: string;
选择器的标题，显示在顶部中间

> 以下需要 useColorScheme Api 的支持
#### dark_tintColor?: string
暗黑模式下确定按钮高亮的颜色，默认为 #1161c1
