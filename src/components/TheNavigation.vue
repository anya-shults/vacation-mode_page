<script setup>
import IconBuyNow from './icons/IconBuyNow.vue';
import IconChevronBottom from './icons/IconChevronBottom.vue';
import IconHelpCenter from './icons/IconHelpCenter.vue';
import IconOnboarding from './icons/IconOnboarding.vue';
</script>

<template>
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item">
        <a class="nav__link" href="#">
          <IconBuyNow />
          <span>Buy now</span>
        </a>
      </li>

      <li class="nav__item">
        <a class="nav__link" href="#">
          <IconOnboarding />
          <span>Onboarding</span>
        </a>
      </li>

      <li class="nav__item">
        <a class="nav__link" href="#">
          <IconHelpCenter />
          <span>Help center</span>
        </a>
      </li>

      <li class="nav__item">
        <a class="nav__link" href="#">
          <IconChevronBottom />
          <span>user@email.com</span>
        </a>
      </li>
    </ul>
  </nav>
</template>

<style scoped lang="scss">
.nav {
  &__list {
    display: flex;
    gap: 4px;
  }

  &__link {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;

    border-radius: 50px;
    padding: 0 16px 0 12px;
    line-height: 32px;

    transition: all 300ms;

    &:hover {
      transition: all 300ms;

      background-color: #9398c333;
    }
  }
}
</style>
