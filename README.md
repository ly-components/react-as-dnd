# react-as-dnd

一个React的拖拽组件

目前仅支持PC，仅在最新的Chrome和Firefox下测试

[DEMO](http://lingyucoder.github.io/react-as-dnd/demo/demo.html)

## 安装

```bash
$ npm install --save react-as-dnd
```

## 使用

```javascript
import React from 'react';
import Draggable from 'react-as-dnd';

React.render(
  <div className="ctn">
    <Draggable>
      <div className="square"></div>
    </Draggable>
  </div>,
  document.getElementById('normal')
);
```

更多使用方式见[DEMO](http://lingyucoder.github.io/react-as-dnd/demo/demo.html)

## 配置

```javascript
start: { x: 0, y: 0 }, //初始时相对offsetParent的位移
grid: { x: 1, y: 1 }, //拖拽网格宽高
dragger: null, //拖拽区域选择器，字符串，为null时内容均可作为拖拽区域
axis: 'both', //拖拽轴，有'both'，'x'，'y'三种
limit: null, //拖拽的限制，可以为'parent'或一个{x:Number, y:Number}对象，为parent时现在在offsetParent内部，为对象时指定最大位移
shadow: true, //是否需要生成影子元素，为true则生成
zIndex: 9999, //指定拖拽元素使用的z-index
onDragStart: noop, //拖拽起始回调
onDragEnd: noop, //拖拽移动回调
onDragMove: noop, //拖拽结束回调
opacity: 0.5, //影子元素的透明度，shadow为false时不起作用
closeSelectOnDrag: true //拖拽时自动加上user-select: none以屏蔽选择行为，默认自动加上
```

onDragStart、onDragEnd、onDragMove都会传递一个事件对象，事件对象额外有如下值：

* dragging: 是否正在拖拽，onDragStart、onDragMove时为true，onDragEnd时为false
* dragStartX: 本次拖拽的起始x位移
* dragStartY: 本次拖拽的起始y位移
* dragOffsetX: 本次拖拽产生的x位移
* dragOffsetY: 本次拖拽产生的y位移
* dragShowX: 本次拖拽的结果x位移
* dragShowY: 本次拖拽的结果y位移

## Development

```bash
$ npm start
$ open http://127.0.0.1:3000/demo/demo.html
```

## License
The MIT License (MIT)

Copyright (c) 2015 天镶

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
