<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { NButton, NDropdown, NEllipsis, NScrollbar } from 'naive-ui'
import { storeToRefs } from 'pinia'
import {
  computed,
  h,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  useTemplateRef,
  watch,
  watchEffect,
} from 'vue'
import { VueDraggable } from 'vue-draggable-plus'

import { ButtonAnimation } from '@/components'
import { tabsInjectionKey } from '@/injection'
import router from '@/router'
import { useConfigureStore } from '@/stores/configure'
import { useTabsStore } from '@/stores/tabs'

import type { Tab } from '@/stores/tabs'
import type { DropdownOption } from 'naive-ui'

type ContextMenuActions = {
  close: () => void
  closeAll: () => void
  closeLeft: () => void
  closeOther: () => void
  closeRight: () => void
  keepAlive: () => void
  lock: () => void
}

const tabsInject = inject(tabsInjectionKey, null)

const scrollbarRef = useTemplateRef<InstanceType<typeof NScrollbar>>('scrollbarRef')

const tabsStore = useTabsStore()

const configureStore = useConfigureStore()

const { tabs, tabActiveKey, keepAliveTabs } = storeToRefs(tabsStore)

const {
  isLocked,
  isPinned,
  hasKeepAliveTab,
  getUnlockedKeysBefore,
  getUnlockedKeysAfter,
  getUnlockedKeysExcept,
  getUnlockedKeys,
  setKeepAliveTab,
  setLocked,
  update,
  remove,
  removeBefore,
  removeAfter,
  removeExcept,
  removeAll,
} = tabsStore

const tabPinnedList = ref<Tab[]>([])

const tabList = ref<Tab[]>([])

const isMounted = ref(false)

const tabBackgroundTransitionClasses = reactive({
  leaveToClass: '',
  enterFromClass: 'scale-0 opacity-0',
})

const isTabDragging = ref(false)

const showTabTooltip = ref(true)

const showTabDropdown = ref(false)

const tabContextMenu = ref<Tab | null>(null)

const tabDropdownOptions = computed<DropdownOption[]>(() => {
  const currentTab = tabContextMenu.value

  if (!currentTab) {
    return []
  }

  const { key, componentName } = currentTab

  return [
    {
      disabled: isLocked(key) || isPinned(key),
      icon: () =>
        h('span', {
          class: 'iconify ph--x',
        }),
      key: 'close',
      label: '关闭',
    },
    {
      disabled: isEmpty(getUnlockedKeysExcept(key)),
      icon: () =>
        h('span', {
          class: 'iconify ph--arrows-out-line-horizontal',
        }),
      key: 'closeOther',
      label: '关闭其他',
    },
    {
      disabled: isEmpty(getUnlockedKeysBefore(key)),
      icon: () =>
        h('span', {
          class: 'iconify ph--arrow-line-left',
        }),
      key: 'closeLeft',
      label: '关闭左侧',
    },
    {
      disabled: isEmpty(getUnlockedKeysAfter(key)),
      icon: () =>
        h('span', {
          class: 'iconify ph--arrow-line-right',
        }),
      key: 'closeRight',
      label: '关闭右侧',
    },
    {
      disabled: isEmpty(getUnlockedKeys()),
      icon: () =>
        h('span', {
          class: 'iconify ph--arrows-horizontal',
        }),
      key: 'closeAll',
      label: '关闭所有',
    },
    {
      disabled: isEmpty(componentName),
      icon: () =>
        hasKeepAliveTab(componentName)
          ? h('span', {
              class: 'iconify-[hugeicons--database-02]',
            })
          : h('span', {
              class: 'iconify-[hugeicons--database-locked]',
            }),
      key: 'keepAlive',
      label: hasKeepAliveTab(componentName) ? '取消缓存' : '缓存标签页',
    },
    {
      disabled: isPinned(key),
      icon: () =>
        isLocked(key)
          ? h('span', {
              class: 'iconify ph--lock-simple-open',
            })
          : h('span', {
              class: 'iconify ph--lock-simple',
            }),
      key: 'lock',
      label: isLocked(key) ? '解锁标签页' : '锁定标签页',
    },
  ]
})

const dropdownPosition = reactive({
  x: 0,
  y: 0,
})

const handleTabClick = (key: string) => {
  router.push(key)
}

const handleTabCloseClick = (key: string) => {
  remove(key)
}

const handleTabContextMenuClick = (e: MouseEvent, tab: Tab) => {
  e.preventDefault()
  tabContextMenu.value = tab
  showTabDropdown.value = false
  showTabTooltip.value = false

  nextTick(() => {
    showTabDropdown.value = true
    dropdownPosition.x = e.clientX
    dropdownPosition.y = e.clientY
  })
}

const onTabDropdownClickOutside = () => {
  showTabDropdown.value = false
  showTabTooltip.value = true
  tabContextMenu.value = null
}

const onTabDraggableStart = () => {
  showTabDropdown.value = false
  showTabTooltip.value = false
}

const onTabDraggableEnd = () => {
  update([...tabPinnedList.value, ...tabList.value])
  showTabTooltip.value = true
}

const onTabDraggableChoose = () => {
  isTabDragging.value = true
}

const onTabDraggableUnchoose = () => {
  isTabDragging.value = false
}

const onTabDropdownSelected = (key: keyof ContextMenuActions) => {
  showTabDropdown.value = false
  showTabTooltip.value = true

  getTabContextMenuActions()?.[key]()
}

const onScrollbarWheeled = (e: WheelEvent) => {
  if (!scrollbarRef.value) return

  scrollbarRef.value.scrollBy({
    left: (e.deltaY || e.deltaX) * 3,
    behavior: 'smooth',
  })
}

function getTabContextMenuActions(): ContextMenuActions | null {
  const tabValue = tabContextMenu.value

  if (!tabValue) {
    return null
  }

  const { key, componentName } = tabValue

  return {
    close: () => {
      remove(key)
    },
    closeAll: () => {
      removeAll()
    },
    closeLeft: () => {
      removeBefore(key)
    },
    closeOther: () => {
      removeExcept(key)
    },
    closeRight: () => {
      removeAfter(key)
    },
    keepAlive: () => {
      if (componentName) {
        setKeepAliveTab(componentName)
      }
    },
    lock: () => {
      setLocked(key)
    },
  }
}

function scrollToActiveTab() {
  nextTick(() => {
    document.querySelector('.tab-active')?.scrollIntoView({
      behavior: 'smooth',
    })
  })
}

watch(
  (): [Tab[], string] => [tabs.value, tabActiveKey.value],
  ([newTabs, newActive], [oldTabs, oldActive]) => {
    if (!newActive) {
      tabBackgroundTransitionClasses.leaveToClass = 'scale-0 opacity-0'
      return
    }

    if (!oldActive) {
      tabBackgroundTransitionClasses.enterFromClass = 'scale-0 opacity-0'
      return
    }

    const oldActiveIndex = oldTabs.findIndex((item) => item.key === oldActive)
    const newActiveIndex = newTabs.findIndex((item) => item.key === newActive)

    if (oldActiveIndex > newActiveIndex && newActiveIndex !== -1) {
      tabBackgroundTransitionClasses.leaveToClass = '-translate-x-full'
      tabBackgroundTransitionClasses.enterFromClass = 'translate-x-full'
    } else {
      tabBackgroundTransitionClasses.leaveToClass = 'translate-x-full'
      tabBackgroundTransitionClasses.enterFromClass = '-translate-x-full'
    }
  },
)

watchEffect(() => {
  tabList.value = tabs.value.filter((tab) => !tab.pinned)
  tabPinnedList.value = tabs.value.filter((tab) => tab.pinned)
})

onMounted(() => {
  nextTick(() => {
    isMounted.value = true
  })
})
</script>
<template>
  <div
    class="flex min-h-0 overflow-hidden border-b border-naive-border bg-naive-card transition-[background-color,border-color] duration-300 ease-naive-bezier"
  >
    <div class="flex shrink-0">
      <div
        v-for="tab in tabPinnedList"
        :key="tab.key"
        class="relative max-w-40 overflow-hidden border-r border-r-naive-border transition-[border-color,max-width] duration-300 ease-naive-bezier select-none"
        :class="[
          isTabDragging ? 'cursor-move' : 'cursor-pointer',
          {
            'tab-active bg-primary/6': tab.key === tabActiveKey,
          },
        ]"
        @click="handleTabClick(tab.key)"
        @contextmenu="(e) => handleTabContextMenuClick(e, tab)"
      >
        <Transition
          enter-active-class="transition-[opacity,scale,translate] duration-300 ease-naive-bezier will-change-[opacity,transform,scale]"
          leave-active-class="transition-[opacity,scale,translate] duration-300 ease-naive-bezier will-change-[opacity,transform,scale]"
          :leave-to-class="tabBackgroundTransitionClasses.leaveToClass"
          :enter-from-class="tabBackgroundTransitionClasses.enterFromClass"
          @after-enter="scrollToActiveTab"
        >
          <div
            v-if="tab.key === tabActiveKey && isMounted"
            class="absolute inset-0 size-full border-t-[1.5px] border-primary bg-primary/6"
          />
        </Transition>
        <div
          class="flex items-center py-2.5 pl-4"
          :class="tab.pinned ? 'pr-4' : 'pr-2.5'"
        >
          <div class="mr-2 grid shrink-0 place-items-center overflow-hidden">
            <span :class="tab.icon" />
          </div>
          <NEllipsis :tooltip="showTabTooltip">{{ tab.label }}</NEllipsis>
        </div>
      </div>
    </div>
    <NScrollbar
      ref="scrollbarRef"
      x-scrollable
      @wheel.passive="onScrollbarWheeled"
    >
      <VueDraggable
        class="flex"
        v-model="tabList"
        :animation="150"
        direction="horizontal"
        force-fallback
        :delay="300"
        ghost-class="bg-primary/30"
        @start="onTabDraggableStart"
        @end="onTabDraggableEnd"
        @choose="onTabDraggableChoose"
        @unchoose="onTabDraggableUnchoose"
      >
        <TransitionGroup
          enter-from-class="max-w-0"
          leave-to-class="max-w-0"
          @after-enter="scrollToActiveTab"
        >
          <div
            v-for="tab in tabList"
            :key="tab.key"
            class="relative overflow-hidden border-r border-r-naive-border transition-[border-color,max-width] duration-300 ease-naive-bezier select-none [&:not(.max-w-0)]:max-w-40"
            :class="[
              isTabDragging ? 'cursor-move' : 'cursor-pointer',
              {
                'tab-active': tab.key === tabActiveKey,
                group: !tab.locked && !configureStore.configure.showTabClose,
              },
            ]"
            @click="handleTabClick(tab.key)"
            @contextmenu="(e) => handleTabContextMenuClick(e, tab)"
          >
            <Transition
              enter-active-class="transition-[opacity,scale,translate] duration-300 ease-naive-bezier will-change-[opacity,transform,scale]"
              leave-active-class="transition-[opacity,scale,translate] duration-300 ease-naive-bezier will-change-[opacity,transform,scale]"
              :leave-to-class="tabBackgroundTransitionClasses.leaveToClass"
              :enter-from-class="tabBackgroundTransitionClasses.enterFromClass"
              @after-enter="scrollToActiveTab"
            >
              <div
                v-if="tab.key === tabActiveKey && isMounted"
                class="absolute inset-0 size-full border-t-[1.5px] border-primary bg-primary/6"
              />
            </Transition>
            <div
              class="flex items-center gap-x-1 py-2.5 pl-4"
              :class="tab.pinned ? 'pr-4' : 'pr-2.5'"
            >
              <div
                class="flex items-center justify-center gap-x-1.5 overflow-hidden transition-[translate] duration-300 ease-naive-bezier"
                :class="{
                  'translate-x-2.5': tab.locked || !configureStore.configure.showTabClose,
                  'group-hover:translate-x-0':
                    !tab.locked && !configureStore.configure.showTabClose,
                }"
              >
                <span
                  :class="[
                    tab.icon,
                    {
                      'text-primary':
                        tab.componentName && keepAliveTabs.includes(tab.componentName),
                    },
                  ]"
                />
                <NEllipsis :tooltip="showTabTooltip">{{ tab.label }}</NEllipsis>
              </div>

              <div
                class="flex transition-[opacity,scale] duration-300 ease-naive-bezier"
                :class="{
                  'scale-0 opacity-0': tab.locked || !configureStore.configure.showTabClose,
                  'group-hover:scale-100 group-hover:opacity-100':
                    !tab.locked && !configureStore.configure.showTabClose,
                }"
              >
                <NButton
                  v-if="!tab.pinned"
                  quaternary
                  circle
                  size="tiny"
                  @click.stop="handleTabCloseClick(tab.key)"
                  :disabled="tab.locked"
                >
                  <template #icon>
                    <span class="iconify ph--x" />
                  </template>
                </NButton>
              </div>
            </div>
          </div>
        </TransitionGroup>
      </VueDraggable>
    </NScrollbar>
    <div class="flex items-center gap-x-2 px-3.5">
      <ButtonAnimation
        title="刷新"
        @click="tabsInject?.doRefresh(true)"
        animation="rotate"
      >
        <span class="iconify size-5 ph--arrows-clockwise"></span>
      </ButtonAnimation>
    </div>
    <NDropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdownPosition.x"
      :y="dropdownPosition.y"
      :options="tabDropdownOptions"
      :show="showTabDropdown"
      @clickoutside="onTabDropdownClickOutside"
      @select="onTabDropdownSelected"
    >
    </NDropdown>
  </div>
</template>
