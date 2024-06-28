<script setup>
import Breadcrumbs from './TheBreadcrumbs.vue';
import Navigation from './TheNavigation.vue';
</script>

<template>
  <header class="header">
    <div class="container">
      <div class="header__wrapper">
        <Breadcrumbs />
        <Navigation />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  background: linear-gradient(90deg, #161b40, #2e3985);

  font-size: 16px;
  font-weight: 400;

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 4px 16px 4px 24px;
  }
}
</style>
