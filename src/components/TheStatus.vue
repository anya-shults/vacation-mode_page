<script setup>
import IconDisabled from './icons/IconDisabled.vue';
import IconEnabled from './icons/IconEnabled.vue';

defineProps({
  isEnabled: Boolean,
});
</script>

<template>
  <span
    class="status"
    :class="isEnabled ? 'status--enabled' : 'status--disabled'"
  >
    <template v-if="!isEnabled">
      <IconDisabled />
      <span>Disabled</span>
    </template>

    <template v-else>
      <IconEnabled />
      <span>Enabled</span>
    </template>
  </span>
</template>

<style scoped lang="scss">
.status {
  display: flex;
  align-items: center;
  gap: 4px;

  width: fit-content;
  padding: 5px 8px;

  border-radius: 22px;
  font-size: 12px;

  &--enabled {
    transition: all 300ms;

    background-color: #e1f6e9;
    color: #00a338;
  }

  &--disabled {
    transition: all 300ms;

    background-color: #eef0f6;
    color: #5e6a75;
  }
}
</style>
