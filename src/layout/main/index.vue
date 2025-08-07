<script setup lang="ts">
import { isEmpty } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { inject, nextTick, onMounted, ref, watch } from 'vue'
import { RouterView } from 'vue-router'

import { tabsInjectionKey } from '@/injection'
import router from '@/router'
import { useConfigureStore } from '@/stores/configure'
import { useTabsStore } from '@/stores/tabs'

import type { Tab } from '@/stores/tabs'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

defineOptions({
  name: 'MainLayout',
})

const tabsInject = inject(tabsInjectionKey, null)

const tabsStore = useTabsStore()

const configureStore = useConfigureStore()

const { tabs, tabActiveKey, keepAliveTabs } = storeToRefs(tabsStore)

const { configure } = storeToRefs(configureStore)

const { create, setActive } = tabsStore

const isNavigating = ref(false)

const transitionName = ref('scale')

const isMounted = ref(false)

let oldTabs: Tab[] = []

function createTab(route: RouteLocationNormalizedLoaded) {
  const {
    pinned,
    componentName,
    icon = 'iconify ph--browser',
    label: defaultLabel = '未命名标签',
    renderTabLabel
  } = route.meta

  const { fullPath, name, params } = route

  const label = renderTabLabel ? renderTabLabel(params) : defaultLabel

  create({
    componentName,
    icon,
    name,
    key: fullPath,
    label,
    pinned,
  })
}

router.beforeEach((_, __, next) => {
  isNavigating.value = true
  next()
})

router.afterEach(() => {
  isNavigating.value = false
})


watch(
  (): [Tab[], string] => [tabs.value, tabActiveKey.value],
  ([newTabs, newActiveKey], [, oldActiveKey]) => {
    if (
      newActiveKey &&
      newActiveKey !== oldActiveKey &&
      newActiveKey !== router.currentRoute.value.fullPath
    ) {
      router.push(newActiveKey)
    }

    if (!configure.value.enableNavigationTransition) return

    if (!configure.value.showTabs) {
      transitionName.value = 'scale'
      return
    }

    const oldActiveIndex = oldTabs.findIndex((item) => item.key === oldActiveKey)
    const newActiveIndex = newTabs.findIndex((item) => item.key === newActiveKey)

    if (oldTabs.length < newTabs.length || oldActiveIndex === -1 || newActiveIndex === -1) {
      transitionName.value = 'scale'
    } else if (oldTabs.length > newTabs.length) {
      transitionName.value =
        oldActiveIndex > newActiveIndex ? 'scale-slider-left' : 'scale-slider-right'
    } else if (oldActiveKey !== newActiveKey) {
      transitionName.value = oldActiveIndex > newActiveIndex ? 'slider-left' : 'slider-right'
    }

    oldTabs = [...newTabs]
  },
)

watch(
  () => tabsInject?.shouldRefresh.value,
  (shouldRefresh) => {
    if (shouldRefresh) {
      transitionName.value = 'shake'
      nextTick(() => {
        tabsInject?.doRefresh(false)
      })
    }
  },
)

watch(
  (): [RouteLocationNormalizedLoaded, boolean] => [router.currentRoute.value, isNavigating.value],
  ([newRoute, isNavigating], oldValue) => {
    if (isNavigating) return

    const oldRoute = oldValue?.[0]

    if (newRoute.fullPath !== oldRoute?.fullPath) {
      const { showTab, enableMultiTab } = newRoute.meta
      const findTab = tabs.value.find((item) =>
        enableMultiTab ? item.key === newRoute.fullPath : item.key === newRoute.path,
      )

      if (!isEmpty(findTab)) {
        setActive(findTab.key)
      } else if (showTab) {
        createTab(newRoute)
      } else {
        setActive('')
      }
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {

  oldTabs = [...tabs.value]

  isMounted.value = true
})
</script>
<template>
  <RouterView
    v-if="configure.enableNavigationTransition"
    v-slot="{ Component, route }"
  >
    <Transition :name="transitionName">
      <KeepAlive :include="keepAliveTabs">
        <component
          :is="Component"
          v-if="isMounted && !tabsInject?.shouldRefresh.value"
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

/* shake */
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
