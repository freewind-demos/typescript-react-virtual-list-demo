// 引入 React 类型与 hooks。
import { type FC, useMemo, useState } from 'react'
// 引入可见区间类型。
import type { VisibleRange } from './getVisibleRange'
// 引入手写虚拟列表组件。
import { VirtualList } from './VirtualList'

// 演示数据总量：足够大以体现虚拟化价值。
const TOTAL_COUNT = 10_000
// 默认行高。
const DEFAULT_ITEM_HEIGHT = 44
// 默认视口高度。
const VIEWPORT_HEIGHT = 440
// 默认 overscan。
const DEFAULT_OVERSCAN = 4

// 根据索引生成一行展示文案。
const buildRowLabel = (index: number) => `第 ${index + 1} 行 · 虚拟列表只渲染视口附近 DOM`

// 普通全量列表行样式。
const rowStyle = (index: number) => ({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
  padding: '0 1rem',
  borderBottom: '1px solid var(--pico-muted-border-color)',
  background: index % 2 === 0 ? 'var(--pico-card-background-color)' : 'transparent',
})

// 页面主组件：对比虚拟列表与全量渲染。
export const App: FC = () => {
  // 是否启用手写虚拟列表。
  const [useVirtual, setUseVirtual] = useState(true)
  // 行高调节。
  const [itemHeight, setItemHeight] = useState(DEFAULT_ITEM_HEIGHT)
  // overscan 调节。
  const [overscan, setOverscan] = useState(DEFAULT_OVERSCAN)
  // 当前虚拟列表挂载区间。
  const [range, setRange] = useState<VisibleRange>({
    startIndex: 0,
    endIndex: -1,
    visibleStartIndex: 0,
    visibleEndIndex: -1,
  })

  // 全量渲染时预生成索引，切换模式可立刻对比卡顿。
  const allIndexes = useMemo(
    () => Array.from({ length: TOTAL_COUNT }, (_, index) => index),
    [],
  )

  // 当前模式下实际挂载 DOM 的行数。
  const mountedCount = useVirtual
    ? Math.max(0, range.endIndex - range.startIndex + 1)
    : TOTAL_COUNT

  return (
    <main className="container">
      <h1>React 手写虚拟列表</h1>
      <p>
        固定行高场景下，根据 <code>scrollTop</code> 计算可见索引，只渲染视口 + overscan 行；
        内层占位高度维持滚动条，不依赖 <code>react-window</code> 等库。
      </p>

      <article>
        <header>控制面板</header>
        <label>
          <input
            type="checkbox"
            role="switch"
            checked={useVirtual}
            onChange={(event) => setUseVirtual(event.target.checked)}
          />
          启用手写虚拟列表（关闭后会一次性渲染 {TOTAL_COUNT.toLocaleString()} 行）
        </label>

        <label>
          行高（px）
          <input
            type="range"
            min={32}
            max={72}
            step={4}
            value={itemHeight}
            onChange={(event) => setItemHeight(Number(event.target.value))}
          />
          {itemHeight}
        </label>

        <label>
          overscan（上下额外渲染行数）
          <input
            type="range"
            min={0}
            max={12}
            step={1}
            value={overscan}
            disabled={!useVirtual}
            onChange={(event) => setOverscan(Number(event.target.value))}
          />
          {overscan}
        </label>

        <p>
          数据总量：<strong>{TOTAL_COUNT.toLocaleString()}</strong>
          {' · '}
          当前挂载 DOM 行数：<strong>{mountedCount.toLocaleString()}</strong>
          {useVirtual && (
            <>
              {' · '}
              视口索引：
              <strong>
                {range.visibleStartIndex} ~ {range.visibleEndIndex}
              </strong>
              {' · '}
              实际渲染索引：
              <strong>
                {range.startIndex} ~ {range.endIndex}
              </strong>
            </>
          )}
        </p>
      </article>

      {useVirtual ? (
        <VirtualList
          totalCount={TOTAL_COUNT}
          itemHeight={itemHeight}
          height={VIEWPORT_HEIGHT}
          overscan={overscan}
          onRangeChange={setRange}
          renderItem={(index) => (
            <div style={rowStyle(index)}>{buildRowLabel(index)}</div>
          )}
        />
      ) : (
        <div
          style={{
            height: VIEWPORT_HEIGHT,
            overflow: 'auto',
            border: '1px solid var(--pico-muted-border-color)',
            borderRadius: 'var(--pico-border-radius)',
          }}
        >
          {allIndexes.map((index) => (
            <div key={index} style={{ ...rowStyle(index), height: itemHeight }}>
              {buildRowLabel(index)}
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
