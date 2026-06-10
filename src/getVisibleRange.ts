// 描述虚拟列表一次应渲染的索引区间。
export type VisibleRange = {
  // 本次实际挂载 DOM 的起始下标（含）。
  startIndex: number
  // 本次实际挂载 DOM 的结束下标（含）。
  endIndex: number
  // 视口顶部对应的理论起始下标（不含 overscan）。
  visibleStartIndex: number
  // 视口底部对应的理论结束下标（不含 overscan）。
  visibleEndIndex: number
}

// 根据滚动位置计算固定行高虚拟列表的可见区间。
export const getVisibleRange = (
  // 容器当前 scrollTop。
  scrollTop: number,
  // 容器可视高度。
  containerHeight: number,
  // 每行固定高度。
  itemHeight: number,
  // 数据总条数。
  totalCount: number,
  // 视口上下额外多渲染的行数，减少快速滚动白屏。
  overscan = 3,
): VisibleRange => {
  // 空列表直接返回全零区间。
  if (totalCount <= 0) {
    return {
      startIndex: 0,
      endIndex: -1,
      visibleStartIndex: 0,
      visibleEndIndex: -1,
    }
  }

  // 视口顶部落在第几行。
  const visibleStartIndex = Math.floor(scrollTop / itemHeight)
  // 视口底部落在第几行。
  const visibleEndIndex = Math.min(
    totalCount - 1,
    Math.ceil((scrollTop + containerHeight) / itemHeight) - 1,
  )

  // 加上 overscan 并限制在合法范围内。
  const startIndex = Math.max(0, visibleStartIndex - overscan)
  const endIndex = Math.min(totalCount - 1, visibleEndIndex + overscan)

  return {
    startIndex,
    endIndex,
    visibleStartIndex,
    visibleEndIndex,
  }
}
