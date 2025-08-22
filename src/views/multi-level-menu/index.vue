<script setup lang="ts">
import { useRoute } from 'vue-router'

import { ContentWrapper } from '@/components'

const route = useRoute()
</script>
<template>
  <ContentWrapper>
    <div class="flex h-96 items-center justify-center text-3xl">
      {{ route.meta.title }}
    </div>
  </ContentWrapper>
</template>
