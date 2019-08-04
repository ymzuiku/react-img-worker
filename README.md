# timeid

此库用来创建一个 App 生命周期内不重复的 id，在单应用内，而非集群中，我们有时候需要简单快速生成唯一的 key；
如 React 对象的 key，生成 key 的行为会非常频繁，我们需要比 uuid 和 nanoid 更高的性能，才能满足 UI 的条件

1. 性能：算法仅是 App 生命周期开始的毫秒数+随机数组成的字符串，性能是 nanoid 的 9 倍，是 uuidv1 的 30 倍
2. 体积：仅有 220b，无任何依赖，兼容 node 和 brower，兼容 typescript
3. 时间：由于 id 是由时间作为前坠，可以记录毫秒外的 id 创建顺序

Math.rendom 已经使用了 Date 作为系数为什么还需要增加 Date.now ？

因为 Date.now + Math.random 的字符串组合，可以以毫秒作为每次 random 的分割，从而降低碰撞。

此函数执行的时间在 macbook-pro 15‘ 上 1ms 可以执行 749 次( < 1000 次), 而 Math.random 的碰撞条件远远大于此数，所以可以躲避碰撞

## 使用

```ts
import timeid from 'timeid';

console.log(timeid()); // 00.327891978321
```
