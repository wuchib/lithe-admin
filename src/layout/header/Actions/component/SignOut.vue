<script setup lang="ts">
import { useDialog } from 'naive-ui'

import { ButtonAnimation } from '@/components'
import { useComponentModifier } from '@/composable/comp/useComponentModifier'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const dialog = useDialog()

const { getModalModifier } = useComponentModifier()
const onSignout = () => {
  dialog.info({
    ...getModalModifier(),
    title: '退出登录',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: onConfirm,
  })
}

const onConfirm = () => {
  userStore.cleanup()
}
</script>
<template>
  <ButtonAnimation @click="onSignout">
    <span class="iconify size-5 ph--sign-out" />
  </ButtonAnimation>
</template>
