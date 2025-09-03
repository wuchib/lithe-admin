<script setup lang="ts">
import { isFunction, isEmpty } from 'lodash-es'
import { NDropdown } from 'naive-ui'
import { h, onMounted, ref, watch, nextTick, computed } from 'vue'

import router from '@/router'
import { useUserStore } from '@/stores'

import type { DropdownProps } from 'naive-ui'

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

const fatherRef = ref<HTMLElement>() // 监听的菜单盒子
const MenuItemsMeta = ref<any>({})
const init = ref(false) // 初始化锁 关

// 剩下的菜单项
const extraMenuItems = ref<any[]>([])

// 更多按钮的显隐
const isShowExtraTrigger = computed(() => !Object.values(MenuItemsMeta.value).every((em: any) => em.isShow))

onMounted(()=>{
  // 记录所有子菜单项的宽度和索引
  userStore.menuList?.forEach((item: any, index: any)=>{
    const menuItemDoms:any[] = Array.from((fatherRef.value as HTMLElement).children)
    const width = menuItemDoms[index].clientWidth + 4
    MenuItemsMeta.value[item.key] = { index, width, key: item.key, isShow: true }
  })
  // 额外记录【更多】按钮
  MenuItemsMeta.value['is-more'] = { index: -1, width: 48, key: 'is-more' } 
  console.log(MenuItemsMeta.value);
  
  // 初始化锁 开
  init.value = true 
  // 找到目标父盒子
  const targetFatherDom = (fatherRef.value as HTMLElement).closest("[data-target]")
  // 开始检测
  observeVisibleChildren(targetFatherDom as HTMLElement, null, handleChildren)
})

function handleChildren(count:number, parentRectWidth:number){
  let totalWidth: number = 0
  for(const key in MenuItemsMeta.value){
    const { index, width } = MenuItemsMeta.value[key]
    MenuItemsMeta.value[key].isShow = index < count
    if(count >= index) totalWidth = totalWidth + width
  } 
  // 控制回显
  if( parentRectWidth > totalWidth ){
    for(const key in MenuItemsMeta.value){  
      const val = MenuItemsMeta.value[key]
      if(val.index === count) val.isShow = true
    }
  }
}



/**
 * 统计父元素中完全可见的子元素数量
 * @param {HTMLElement} parent - 父容器元素
 * @param {string} childSelector - 子元素选择器（默认直接取 parent.children）
 * @param {Function} callback - 数量变化时的回调函数
 * @returns {ResizeObserver} 返回 ResizeObserver 实例，可自行 disconnect()
 */
function observeVisibleChildren(parent:HTMLElement, childSelector = null, callback :any) {
  if (!parent || !fatherRef.value) {
    throw new Error("父元素不能为空");
  }
  const getChildren = () => childSelector 
    ? (fatherRef.value as HTMLElement).querySelectorAll(childSelector) 
    : (fatherRef.value as HTMLElement)?.children;

  function countFullyVisibleChildren() {
    const parentRect = parent.getBoundingClientRect();
    let count = 0;
    const moreDivWidth = isShowExtraTrigger.value ? 48 : 0
    const parentRectWidth = parentRect.width - moreDivWidth
    Array.from(getChildren() || []).forEach(child => {
      const rect = child.getBoundingClientRect();
      if (rect.left >= parentRect.left && rect.right <= parentRect.right) {
        count++;
      }
    });

    if (callback) callback(isShowExtraTrigger.value ? count - 1 : count, parentRectWidth);
    return count;
  }

  // 初始计算
  // countFullyVisibleChildren();

  // 监听父元素宽度变化
  const resizeObserver = new ResizeObserver(() => {
    countFullyVisibleChildren();
  });
  resizeObserver.observe(parent);

  return resizeObserver;
}


</script>
<template>
  <div data-wrap class="relative flex w-full items-center gap-x-1 truncate" ref="fatherRef">
    <template
      v-for="({ disabled, key, type, label, icon, children }, i) in userStore.menuList"
      :key="key"
    >
      <div
        v-if="!type && isEmpty(children)"
        v-show="!init || MenuItemsMeta[key as any]?.isShow"
        :data-key="key"
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
          v-show="!init || MenuItemsMeta[key as any]?.isShow"
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
  
    <!-- downMenu -->
    <n-dropdown
        :options="extraMenuItems"
        placement="bottom-start"
        trigger="hover"
      >
      <div is-more v-show="isShowExtraTrigger" class="relative flex items-center rounded-naive px-2.5 py-2 transition-[background-color,color]">
        更多
      </div>
    </n-dropdown>
  </div>
</template>

<style>
</style>
