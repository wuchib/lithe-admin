import { isString, debounce, isElement } from 'lodash-es'
import { isRef, nextTick, onMounted, reactive, ref, onBeforeUnmount } from 'vue'

import type { ComponentPublicInstance, Ref } from 'vue'

type MaybeHTMLElement = HTMLElement | Ref<HTMLElement | null> | string | null

interface DataTableOptions {
  parentContainer?: MaybeHTMLElement
  parentWrap?: MaybeHTMLElement
}

type EltKey = 'container' | 'dataTable' | 'table' | 'tableThead' | 'wrap'

export function useDataTable<T extends ComponentPublicInstance>(
  target: Ref<T | null>,
  options: DataTableOptions = {},
) {
  const { parentContainer = '.main-container', parentWrap = '.main-wrap' } = options

  let resizeObserver: ResizeObserver | null = null

  const maxHeight = ref<number | undefined>(0)

  const eltNode = reactive<Record<EltKey, HTMLElement | null>>({
    dataTable: null,
    table: null,
    tableThead: null,
    container: null,
    wrap: null,
  })

  function updateMaxHeight() {
    const { container, wrap, tableThead, table } = eltNode

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

  const debouncedFn = debounce(() => {
    updateMaxHeight()
  }, 300)

  function getParentElt(elt: MaybeHTMLElement) {
    if (isString(elt)) return eltNode.dataTable?.closest<HTMLElement>(elt) ?? null
    if (isRef(elt)) return elt.value
    if (isElement(elt)) return elt
    return null
  }

  function initTableResizeObserver() {
    if (!target.value) {
      maxHeight.value = undefined
      return
    }

    eltNode.dataTable = (target.value?.$el as HTMLElement) ?? null
    eltNode.table = eltNode.dataTable?.querySelector('.n-data-table-base-table') ?? null
    eltNode.tableThead = eltNode.table?.querySelector('.n-data-table-thead') ?? null

    nextTick(() => {
      eltNode.container = getParentElt(parentContainer)
      eltNode.wrap = getParentElt(parentWrap)

      const missingKeys = Object.entries(eltNode)
        .filter((value) => value[1] == null)
        .map(([key]) => key)

      if (missingKeys.length) {
        throw new Error(`Missing or null elements: ${missingKeys.join(', ')}`)
      }

      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { height } = entry.contentRect
          if (height) debouncedFn()
        }
      })

      if (eltNode.container) {
        resizeObserver.observe(eltNode.container)
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
