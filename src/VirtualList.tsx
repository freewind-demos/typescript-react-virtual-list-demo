// 引入 React 类型与 hooks。
import { type FC, type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react'
// 引入可见区间计算纯函数。
import { getVisibleRange } from './getVisibleRange'

// 虚拟列表组件的 props。
export type VirtualListProps = {
  // 数据总条数。
  totalCount: number
  // 每行固定高度（px）。
  itemHeight: number
  // 滚动容器高度（px）。
  height: number
  // 视口上下额外渲染行数。
  overscan?: number
  // 根据索引渲染一行内容。
  renderItem: (index: number) => ReactNode
  // 可见区间变化时回调，便于 demo 展示状态。
  onRangeChange?: (range: ReturnType<typeof getVisibleRange>) => void
}

// 手写固定行高虚拟列表：只挂载视口附近 DOM，靠占位高度维持滚动条。
export const VirtualList: FC<VirtualListProps> = ({
  totalCount,
  itemHeight,
  height,
  overscan = 3,
  renderItem,
  onRangeChange,
}) => {
  // 滚动容器 ref，读取 scrollTop。
  const containerRef = useRef<HTMLDivElement>(null)
  // 当前 scrollTop，滚动时触发重算可见区间。
  const [scrollTop, setScrollTop] = useState(0)

  // 根据 scrollTop 计算本次要渲染的索引区间。
  const range = useMemo(
    () => getVisibleRange(scrollTop, height, itemHeight, totalCount, overscan),
    [scrollTop, height, itemHeight, totalCount, overscan],
  )

  // 区间变化时通知外层（demo 用来展示 mounted 数量）。
  useEffect(() => {
    onRangeChange?.(range)
  }, [onRangeChange, range])

  // 滚动时同步 scrollTop 到 state。
  const handleScroll = useCallback(() => {
    const nextScrollTop = containerRef.current?.scrollTop ?? 0
    setScrollTop(nextScrollTop)
  }, [])

  // 全列表占位高度，决定滚动条长度。
  const totalHeight = totalCount * itemHeight
  // 当前要挂载的行索引数组。
  const mountedIndexes = useMemo(() => {
    const indexes: number[] = []
    for (let index = range.startIndex; index <= range.endIndex; index += 1) {
      indexes.push(index)
    }
    return indexes
  }, [range.endIndex, range.startIndex])

  return (
    // 外层滚动容器：固定高度 + overflow auto。
    <div
      ref={containerRef}
      onScroll={handleScroll}
      style={{
        height,
        overflow: 'auto',
        border: '1px solid var(--pico-muted-border-color)',
        borderRadius: 'var(--pico-border-radius)',
      }}
    >
      {/* 内层占位：撑出完整滚动高度 */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {mountedIndexes.map((index) => (
          // 每行绝对定位到真实偏移，模拟完整列表布局。
          <div
            key={index}
            style={{
              position: 'absolute',
              top: index * itemHeight,
              left: 0,
              right: 0,
              height: itemHeight,
              boxSizing: 'border-box',
            }}
          >
            {renderItem(index)}
          </div>
        ))}
      </div>
    </div>
  )
}
