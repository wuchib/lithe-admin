import { isString, debounce, isElement } from 'lodash-es'
import { isRef, nextTick, onMounted, reactive, ref, onBeforeUnmount } from 'vue'

import type { ComponentPublicInstance, Ref } from 'vue'

type MaybeHTMLElement = HTMLElement | Ref<HTMLElement | null> | string | null

interface DataTableOptions {
  parentContainer?: MaybeHTMLElement
  parentWrap?: MaybeHTMLElement
}

type ElementKey = 'container' | 'dataTable' | 'table' | 'tableThead' | 'wrap'

export function useDataTable<T extends ComponentPublicInstance>(
  target: Ref<T | null>,
  options: DataTableOptions = {},
) {
  const { parentContainer = '.main-container', parentWrap = '.main-wrap' } = options

  let resizeObserver: ResizeObserver | null = null

  const maxHeight = ref<number | undefined>(0)

  const elementMap = reactive<Record<ElementKey, HTMLElement | null>>({
    dataTable: null,
    table: null,
    tableThead: null,
    container: null,
    wrap: null,
  })

  function updateMaxHeight() {
    const { container, wrap, tableThead, table } = elementMap

    if (!container || !wrap || !tableThead || !table) {
      return
    }

    const containerHeight = container.offsetHeight
    const wrapHeight = wrap.offsetHeight
    const theadHeight = tableThead.offsetHeight
    const tableHeight = table.offsetHeight

    maxHeight.value =
      (containerHeight < wrapHeight
        ? tableHeight - theadHeight - (wrapHeight - containerHeight)
        : containerHeight - wrapHeight - theadHeight + tableHeight) - 1
  }

  const debounceUpdateMaxHeight = debounce(() => {
    updateMaxHeight()
  }, 300)

  function getParentElement(element: MaybeHTMLElement) {
    if (isString(element)) return elementMap.dataTable?.closest<HTMLElement>(element) ?? null
    if (isRef(element)) return element.value
    if (isElement(element)) return element
    return null
  }

  function initTableResizeObserver() {
    if (!target.value) {
      maxHeight.value = undefined
      return
    }

    elementMap.dataTable = (target.value?.$el as HTMLElement) ?? null
    elementMap.table = elementMap.dataTable?.querySelector('.n-data-table-base-table') ?? null
    elementMap.tableThead = elementMap.table?.querySelector('.n-data-table-thead') ?? null

    nextTick(() => {
      elementMap.container = getParentElement(parentContainer)
      elementMap.wrap = getParentElement(parentWrap)

      const missingKeys = Object.entries(elementMap)
        .filter((value) => value[1] == null)
        .map(([key]) => key)

      if (missingKeys.length) {
        throw new Error(`Missing or null elements: ${missingKeys.join(', ')}`)
      }

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect
          if (height) debounceUpdateMaxHeight()
        }
      })

      if (elementMap.container) {
        resizeObserver.observe(elementMap.container)
      }
    })
  }

  onMounted(() => {
    initTableResizeObserver()
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return {
    maxHeight,
    updateMaxHeight,
  }
}
