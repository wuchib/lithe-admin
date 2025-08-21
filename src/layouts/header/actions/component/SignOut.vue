<script setup lang="ts">
import { useDialog } from 'naive-ui'

import { ButtonAnimation } from '@/components'
import { useComponentModifier } from '@/composable'
import { useUserStore } from '@/stores'

const userStore = useUserStore()
const dialog = useDialog()

const { getModalModifier } = useComponentModifier()

const handleSignOutClick = () => {
  dialog.info({
    ...getModalModifier(),
    title: '退出登录',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: cleanupUserInfo,
  })
}

function cleanupUserInfo() {
  userStore.cleanup()
}
</script>
<template>
  <ButtonAnimation @click="handleSignOutClick">
    <span class="iconify ph--sign-out" />
  </ButtonAnimation>
</template>
