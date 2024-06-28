<script setup>
import iconSuccess from './icons/IconSuccess.vue';
import IconError from './icons/IconError.vue';

defineProps({
  isVisible: Boolean,
  isError: Boolean,
});

defineEmits(['close']);
</script>

<template>
  <Transition name="popup">
    <div v-if="isVisible" class="update-popup">
      <div
        :class="isError ? 'update-popup__icon--error' : 'update-popup__icon'"
      >
        <iconSuccess v-if="!isError" />
        <IconError v-else />
      </div>

      <div class="update-popup__text">
        <h2 class="update-popup__header">
          <span v-if="!isError">Success</span>
          <span v-else>Error</span>
        </h2>

        <span class="description" v-if="!isError">Updated successfully.</span>
        <span class="description" v-else>Try again.</span>
      </div>

      <div class="update-popup__close">
        <button class="update-popup__button" @click="$emit('close')">
          Close
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.update-popup {
  display: flex;
  align-items: center;
  width: 420px;

  background-color: #fff;

  border-radius: 4px;

  box-shadow: 3px 3px 22px #00000017;

  @media (max-width: 500px) {
    width: 80%;
  }

  &__icon {
    padding: 11px 9px;

    border-left: 4px solid #3fb34f;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;

    &--error {
      padding: 11px 9px;

      border-left: 4px solid #f5455a;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 4px;

    width: 317px;
    padding: 8px 0 8px 8px;

    h2 {
      font-size: 14px;
      text-transform: uppercase;
    }
  }

  &__close {
    border-left: 1px solid #1d24521a;

    button {
      text-transform: uppercase;

      border: none;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      background-color: #fff;

      padding: 23px 8px;

      color: #1d245280;
      font-size: 10px;
      font-weight: 400;

      cursor: pointer;

      transition: background-color 300ms;

      &:hover {
        transition: background-color 300ms;

        background-color: #faf8f8;
      }
    }
  }
}

.popup-enter-active,
.popup-leave-active {
  transition: all 300ms;
}

.popup-enter-from,
.popup-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
