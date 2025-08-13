<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import router from '@/router'
import { usePreferencesStore } from '@/stores/preferences'
import { useTabsStore } from '@/stores/tabs'

import type { Tab } from '@/stores/tabs'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const layoutsRedirect = router.getRoutes().find((item) => item.name === 'layouts')?.redirect

const tabsStore = useTabsStore()

const preferencesStore = usePreferencesStore()

const { createTab, setTabActivePath } = tabsStore

const navigationTransitionName = ref('scale')

const isMounted = ref(false)

const keepAliveTabs = computed(() => {
  return tabsStore.tabs.filter((tab) => tab.keepAlived).map((tab) => tab.componentName ?? '')
})

let oldTabs: Tab[] = []

function createTabFromRoute(route: RouteLocationNormalizedLoaded) {
  const {
    icon = 'iconify ph--browser',
    title: label = '未命名标签',
    renderTabTitle,
    componentName,
    pinned,
  } = route.meta

  const { fullPath, name, params } = route

  const title = renderTabTitle ? renderTabTitle(params) : label

  createTab({
    path: fullPath,
    icon,
    title,
    name,
    componentName,
    pinned,
  })
}

watch(
  (): [Tab[], string] => [tabsStore.tabs, tabsStore.tabActivePath],
  ([newTabs, newTabActivePath], [, oldTabActivePath]) => {
    if (
      newTabActivePath &&
      newTabActivePath !== oldTabActivePath &&
      newTabActivePath !== router.currentRoute.value.fullPath
    ) {
      if (
        layoutsRedirect &&
        layoutsRedirect === router.currentRoute.value.path &&
        newTabActivePath === '/'
      ) {
        router.go(0)
      } else {
        router.push(newTabActivePath)
      }
    }

    if (!preferencesStore.preferences.enableNavigationTransition) return

    if (!preferencesStore.preferences.showTabs) {
      navigationTransitionName.value = 'scale'
      return
    }

    const oldActiveIndex = oldTabs.findIndex((item) => item.path === oldTabActivePath)
    const newActiveIndex = newTabs.findIndex((item) => item.path === newTabActivePath)

    if (oldTabs.length < newTabs.length || oldActiveIndex === -1 || newActiveIndex === -1) {
      navigationTransitionName.value = 'scale'
    } else if (oldTabs.length > newTabs.length) {
      navigationTransitionName.value =
        oldActiveIndex > newActiveIndex ? 'scale-slider-left' : 'scale-slider-right'
    } else if (oldTabActivePath !== newTabActivePath) {
      navigationTransitionName.value =
        oldActiveIndex > newActiveIndex ? 'slider-left' : 'slider-right'
    }

    oldTabs = [...newTabs]
  },
)

watch(
  () => preferencesStore.preferences.shouldRefreshTab,
  (shouldRefresh) => {
    if (shouldRefresh) {
      navigationTransitionName.value = 'shake'
      nextTick(() => {
        preferencesStore.modify({
          shouldRefreshTab: false,
        })
      })
    }
  },
)

watch(
  () => router.currentRoute.value,
  (newRoute, oldRoute) => {
    if (newRoute.fullPath !== oldRoute?.fullPath) {
      const { showTab, enableMultiTab } = newRoute.meta
      const targetPath = enableMultiTab ? newRoute.fullPath : newRoute.path

      const findTab = tabsStore.tabs.find((item) => item.path === targetPath)

      if (!isEmpty(findTab)) {
        setTabActivePath(findTab.path)
      } else if (showTab) {
        createTabFromRoute(newRoute)
      } else {
        setTabActivePath('')
      }
    }
  },
  {
    immediate: true,
  },
)

onMounted(() => {
  oldTabs = [...tabsStore.tabs]
  isMounted.value = true
})
</script>
<template>
  <RouterView
    v-if="preferencesStore.preferences.enableNavigationTransition"
    v-slot="{ Component, route }"
  >
    <Transition :name="navigationTransitionName">
      <KeepAlive :include="keepAliveTabs">
        <component
          :is="Component"
          v-if="isMounted && !preferencesStore.preferences.shouldRefreshTab"
          :key="route.path + JSON.stringify(route.query)"
        />
      </KeepAlive>
    </Transition>
  </RouterView>
  <RouterView v-else />
</template>
<style scoped>
.slider-left-enter-active,
.slider-right-enter-active,
.slider-left-leave-active,
.slider-right-leave-active {
  position: absolute;
  width: 100%;
  transition: translate 500ms var(--cubic-bezier-ease-in-out) 75ms;
  will-change: translate;
}

.slider-left-enter-from,
.slider-right-leave-to {
  translate: -100%;
}

.slider-left-leave-to,
.slider-right-enter-from {
  translate: 100%;
}

.slider-left-enter-to,
.slider-left-leave-from,
.slider-right-enter-to,
.slider-right-leave-from {
  translate: 0;
}

.scale-slider-left-enter-active,
.scale-slider-left-leave-active,
.scale-slider-right-enter-active,
.scale-slider-right-leave-active {
  position: absolute;
  width: 100%;
  transition:
    scale 500ms var(--cubic-bezier-ease-in-out) 75ms,
    translate 500ms var(--cubic-bezier-ease-in-out) 75ms,
    opacity 300ms var(--cubic-bezier-ease-in-out) 75ms;
  will-change: scale, translate, opacity;
}

.scale-slider-left-leave-to,
.scale-slider-right-leave-to {
  scale: 0.5;
  opacity: 0;
}

.scale-slider-left-enter-from {
  translate: -100%;
}

.scale-slider-right-enter-from {
  translate: 100%;
}

.scale-enter-active,
.scale-leave-active {
  position: absolute;
  width: 100%;
  transition:
    scale 300ms var(--cubic-bezier-ease-in-out) 75ms,
    opacity 300ms var(--cubic-bezier-ease-in-out) 75ms;
  will-change: scale, opacity;
}

.scale-enter-from,
.scale-leave-to {
  scale: 0.5;
  opacity: 0;
}

.shake-enter-active {
  animation: shake var(--cubic-bezier-ease-in-out) 500ms;
}

@keyframes shake {
  0% {
    translate: 0 0;
    rotate: 0deg;
  }
  8% {
    translate: -2px -1px;
    rotate: -0.6deg;
  }
  16% {
    translate: 1px -2px;
    rotate: 0.9deg;
  }
  24% {
    translate: -1px 2px;
    rotate: -0.5deg;
  }
  32% {
    translate: 2px -1px;
    rotate: 0.7deg;
  }
  40% {
    translate: -1px -2px;
    rotate: -0.8deg;
  }
  48% {
    translate: 1px 2px;
    rotate: 0.4deg;
  }
  56% {
    translate: -2px 1px;
    rotate: -0.7deg;
  }
  64% {
    translate: 2px -1px;
    rotate: 0.8deg;
  }
  72% {
    translate: -1px -1px;
    rotate: -0.5deg;
  }
  80% {
    translate: 2px 1px;
    rotate: 0.6deg;
  }
  88% {
    translate: -1px 1px;
    rotate: -0.4deg;
  }
  96% {
    translate: 1px -1px;
    rotate: 0.3deg;
  }
  100% {
    translate: 0 0;
    rotate: 0deg;
  }
}
</style>
