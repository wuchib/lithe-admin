<script setup lang="ts">
import { NCard, NAlert, NButton } from 'naive-ui'
import { RouterLink, useRouter } from 'vue-router'

defineOptions({
  name: 'DynamicRoute',
})

const router = useRouter()
</script>
<template>
  <div class="flex flex-col gap-y-2 p-4">
    <NAlert
      type="info"
      closable
    >
      在路由配置的 meta 中添加 enableMultiTab 属性，访问不同的动态路径时都创建一个 tab
    </NAlert>
    <NCard>
      <div class="grid grid-cols-5 gap-4">
        <RouterLink
          v-for="value in 50"
          :key="value"
          :to="value <= 25 ? `/dynamic-route/${value}` : `/dynamic-route/${value}/${value}`"
        >
          <NButton
            block
            secondary
            :type="
              [`/dynamic-route/${value}`, `/dynamic-route/${value}/${value}`].includes(
                router.currentRoute.value.fullPath,
              )
                ? 'primary'
                : 'default'
            "
          >
            {{
              value <= 25 ? `/dynamic-route/${value}` : `/dynamic-route/${value}/${value}`
            }}</NButton
          >
        </RouterLink>
      </div>
    </NCard>
  </div>
</template>
<style></style>
