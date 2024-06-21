<script setup lang="ts">
interface UserData {
  avatar_url: string;
}

defineProps<{
  username?: string;
  fetchError: boolean;
  isLoading: boolean;
  userData?: UserData | null;
}>();
</script>

<template>
  <div v-if="!username || fetchError" class="avatar none"></div>
  <div v-else-if="isLoading" class="avatar">
    <Icon name="svg-spinners:bars-rotate-fade" size="32" />
  </div>
  <img v-else-if="userData" :src="userData.avatar_url" class="avatar" />
</template>

<style lang="scss">
.avatar {
  align-items: center;
  display: flex;
  justify-content: center;
  height: 40px;
  width: 40px;
  border-radius: 99px;
  box-shadow: 0px 3px 5px #000;
}
.none {
  background-color: #95f386;
  color: #000;
  font-size: 8px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}
</style>
