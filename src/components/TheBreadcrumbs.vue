<script setup>
import IconChevronRight from './icons/IconChevronRight.vue';
</script>

<template>
  <div class="breadcrumbs">
    <a href="#">Dashboard</a>
    <IconChevronRight />
    <a href="#">User Management</a>
  </div>
</template>

<style scoped>
.breadcrumbs {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}
</style>
