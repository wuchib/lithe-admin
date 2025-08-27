<script setup lang="ts">
import { isFunction, isEmpty } from 'lodash-es'
import { NDropdown } from 'naive-ui'
import { h, onMounted, ref, watch, nextTick } from 'vue'

import router from '@/router'
import { useUserStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'
import { useElementSize } from '@vueuse/core'

const userStore = useUserStore()

const menuActiveKey = ref('')

const renderIcon: DropdownProps['renderIcon'] = (option) => {
  return isFunction(option.icon)
    ? h(option.icon, {
        class: 'ml-2 size-5',
      })
    : null
}

function hasActiveChild(children: any[]): boolean {
  const stack = [...children]
  while (stack.length) {
    const node = stack.pop()
    if (node?.key === menuActiveKey.value) return true
    if (Array.isArray(node?.children)) {
      stack.push(...node.children)
    }
  }
  return false
}

watch(
  () => router.currentRoute.value,
  (newRoute) => {
    menuActiveKey.value = newRoute.name as string
  },
  {
    immediate: true,
  },
)

const fatherRef = ref()
const totalMenuItemsWidth = ref<any>(0)
const widths = ref<any[]>([]) //这里按顺序存储每一个menuItem的宽度
const testInit = ref(true)
const curWidths = ref<any[]>([])
onMounted(()=>{
  const children = Array.from(fatherRef.value.children) 
  totalMenuItemsWidth.value = children.reduce((pre:any, cur:any)=>{
    widths.value.push(cur.clientWidth)
    curWidths.value.push(cur.clientWidth)
    return cur.clientWidth + pre
  },0)
  console.log(totalMenuItemsWidth.value);
  console.log(widths.value);
  console.log(curWidths.value);
})


const { width, height } = useElementSize(fatherRef)
watch(()=>width.value,w=>{
  if(w < totalMenuItemsWidth.value){
    // 1.隐藏最后一个menuItem
    curWidths.value.pop()
    // 2.totalMenuItemsWidth = totalMenuItemsWidth - 隐藏的 menuItem 宽度
    totalMenuItemsWidth.value = curWidths.value.reduce((pre,cur)=>cur + pre,0)
    testInit.value = false
  }else{
    // 菜单项回显
  }
})

</script>
<template>
  <div class="relative flex w-full items-center gap-x-1 truncate" ref="fatherRef">
    <template
      v-for="({ disabled, key, type, label, icon, children }, i) in userStore.menuList"
      :key="key"
    >
      <div
        v-if="!type && isEmpty(children)"
        :data-key="key"
        :is-hidden="i > curWidths.length - 1 && !testInit"
        class="relative flex items-center rounded-naive px-2.5 py-2 transition-[background-color,color]"
        :class="[
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
          menuActiveKey === key
            ? 'menu-active bg-primary/15 text-primary'
            : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
        ]"
      >
        <component
          v-if="isFunction(icon)"
          :is="icon()"
          class="mr-2 size-5"
        />
        <component
          v-if="isFunction(label)"
          :is="label()"
          class="before:absolute before:inset-0 before:size-full before:content-['']"
        />
        <span v-else>{{ label }}</span>
      </div>
      <NDropdown
        v-if="!type && Array.isArray(children) && !isEmpty(children)"
        :options="children"
        :value="menuActiveKey"
        :render-icon="renderIcon"
      >
        <div
          :data-key="key"
          :is-hidden="i > curWidths.length - 1 && !testInit"
          class="flex items-center rounded-naive py-2 pr-2 pl-2.5 transition-[background-color,color]"
          :class="[
            disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer',
            hasActiveChild(children)
              ? 'menu-active bg-primary/15 text-primary'
              : 'hover:bg-neutral-150 dark:hover:bg-neutral-800',
          ]"
        >
          <component
            v-if="isFunction(icon)"
            :is="icon()"
            class="mr-2 size-5"
          />
          <span>{{ label }}</span>
          <span class="ml-1.5 iconify ph--caret-down" />
        </div>
      </NDropdown>
    </template>
  </div>
</template>

<style>
[is-hidden="true"] {
  display: none !important;
}
</style>
