# React 手写虚拟列表 Demo

## 简介

演示如何在 React 中**不借助第三方虚拟列表库**，手动实现固定行高的虚拟滚动：根据 `scrollTop` 计算可见索引，只挂载视口附近的 DOM，同时用占位高度维持正确的滚动条。

## 快速开始

### 环境要求

- Node.js 18+
- pnpm

### 运行

```bash
cd typescript-react-virtual-list-demo
pnpm install
pnpm run dev
```

## 注意事项

- 本 demo 只覆盖**固定行高**场景；变高列表需要额外维护每行累计高度表。
- 关闭「启用手写虚拟列表」后会一次性渲染 10,000 行，用于对比卡顿，请谨慎在低配机器上操作。

## 教程

### 1. 为什么需要虚拟列表

长列表若全量渲染，DOM 节点数与数据量线性增长，滚动和重排成本会迅速失控。虚拟化的核心思路是：**滚动条仍代表完整列表，但 DOM 只保留视口附近一小段。**

### 2. demo 原理

1. 外层容器 `overflow: auto`，监听 `scroll` 事件读取 `scrollTop`。
2. 用纯函数 `getVisibleRange` 把 `scrollTop`、容器高度、行高换算成起始/结束索引。
3. 在索引上下各加 `overscan` 行，减少快速滚动时的白屏。
4. 内层放一个高度为 `totalCount * itemHeight` 的占位层，保证滚动条长度正确。
5. 只对当前区间内的索引 `map` 出绝对定位的行节点。

### 3. 关键代码

`getVisibleRange.ts` 负责把滚动位置转成索引区间。

`VirtualList.tsx` 负责：

- 维护 `scrollTop` state
- 根据区间只渲染少量行
- 每行 `position: absolute; top: index * itemHeight`

`App.tsx` 提供对比开关：同一套数据可在「虚拟列表」与「全量渲染」之间切换，并实时显示当前挂载行数。

## 操作

1. 勾选「启用手写虚拟列表」，快速滚动，观察挂载行数始终只有十几行。
2. 调节 `overscan`，看快速滚动时上下缓冲如何变化。
3. 关闭虚拟列表开关，感受 10,000 行全量渲染的初始化与滚动差异。
