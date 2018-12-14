# weapp-adapter for pixi.js

## 编译

```
npm install
```

```
npm run build
```

## 主要改动

### 输出TouchEvent

官方的`adapter`并没有把`TouchEvent`绑定到`window`，改动也很简单。首先，修改`src/EventIniter/TouchEvent.js`把默认的`TouchEvent`类输出：
```javascript
export default class TouchEvent {
	...
}
```
随后，修改`src/window.js`，将其输出即可：

```javascript
export TouchEvent from './EventIniter/TouchEvent'
```

### 关于点击位置映射为题

`pixi.js`对元素的位置映射有特殊的处理，在其
```javascript
InteractionManager.prototype.mapPositionToPoint = function mapPositionToPoint(point, x, y) {
        var rect = void 0;

        // IE 11 fix
        if (!this.interactionDOMElement.parentElement) {
            rect = { x: 0, y: 0, width: 0, height: 0 };
        } else {
            rect = this.interactionDOMElement.getBoundingClientRect();
        }

        var resolutionMultiplier = navigator.isCocoonJS ? this.resolution : 1.0 / this.resolution;

        point.x = (x - rect.left) * (this.interactionDOMElement.width / rect.width) * resolutionMultiplier;
        point.y = (y - rect.top) * (this.interactionDOMElement.height / rect.height) * resolutionMultiplier;
    };
```
会对`interactionDOMElement`的`parentElement`进行检测，这里的`interactionDOMElement`元素就是`weapp-adapter`输出的`canvas`元素，显然其`parentElement`元素总是为空的，因此，上述函数总是返回空的区域，为了解决这个问题，有两种方法，一种就是直接覆盖这个函数自己想法重新映射：
```javascript
PIXI.interaction.InteractionManager.prototype.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio
    point.y = y * pixelRatio
}
```
或者
```javascript
app.renderer.plugins.interaction.mapPositionToPoint = (point, x, y) => {
    point.x = x * pixelRatio
    point.y = y * pixelRatio
}
```
另外一种就是修改`weapp-adapter`的`canvas`对象，将其`parentElement`设置为`true`。在`src/Canvas.js`文件中，增加：
```javascript
// pixi.js mapPositionToPoint hack
  canvas.__proto__.parentElement = true
```
这里采用第二种方式。

### `ajax`相关问题

`PIXI.loader`与`ajax`相关的问题，在`src/XMLHttpRequest.js`中增加：
```javascript
addEventListener(ev, cb) {
  this[`on${ev}`] = cb
}
```