// 引入 Vitest 断言与测试函数。
import { expect, test } from 'vitest'
// 引入待测纯函数。
import { getVisibleRange } from './getVisibleRange'

// 验证视口顶部时的可见区间。
test('returns range at scroll top', () => {
  expect(
    getVisibleRange(0, 400, 40, 100, 2),
  ).toMatchInlineSnapshot(`
    {
      "endIndex": 11,
      "startIndex": 0,
      "visibleEndIndex": 9,
      "visibleStartIndex": 0,
    }
  `)
})

// 验证滚动到中间时的可见区间。
test('returns range in the middle', () => {
  expect(
    getVisibleRange(2000, 400, 40, 100, 2),
  ).toMatchInlineSnapshot(`
    {
      "endIndex": 61,
      "startIndex": 48,
      "visibleEndIndex": 59,
      "visibleStartIndex": 50,
    }
  `)
})

// 验证滚动到底部时不会越界。
test('clamps range at list bottom', () => {
  expect(
    getVisibleRange(3600, 400, 40, 100, 3),
  ).toMatchInlineSnapshot(`
    {
      "endIndex": 99,
      "startIndex": 87,
      "visibleEndIndex": 99,
      "visibleStartIndex": 90,
    }
  `)
})
