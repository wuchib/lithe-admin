<script setup lang="ts">
import { ButtonAnimation } from '@/components'
import Avatar from '@/components/UserAvatar.vue'
import UserDropdown from '@/components/UserDropdown.vue'
</script>
<template>
  <div class="ml-4">
    <UserDropdown placement="bottom-end">
      <ButtonAnimation animation="beat">
        <Avatar src="src path" />
      </ButtonAnimation>
    </UserDropdown>
  </div>
</template>
