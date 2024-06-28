<script setup>
defineProps({
  number: Number,
});
</script>

<template>
  <div class="number">{{ number }}</div>
</template>

<style scoped>
.number {
  width: 20px;
  height: 20px;

  border-radius: 50px;
  background-color: #415ada;

  color: #fff;
  font-size: 12px;
  font-weight: 700;

  text-align: center;
  line-height: 20px;
}
</style>
