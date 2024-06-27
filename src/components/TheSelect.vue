<script setup>
import { ref, watch } from 'vue';
import debounce from 'lodash.debounce';
import IconChevronFillBottom from './icons/IconChevronFillBottom.vue';
import { searchUser } from '@/api/users';

defineProps({
  isTable: Boolean,
  selectLabel: String,
  inputValue: String,
});

const emits = defineEmits(['getUser', 'removeUser']);

let isLoading = ref(true);
let isActive = ref(false);
let inputText = ref('');
let userList = ref([]);

const select = ref(null);

const handleLinkClick = (user) => {
  inputText.value = user.email;
  emits('getUser', user);
};

const handleEscClick = () => {
  select.value.blur();
};

const handleBlur = debounce(() => {
  isActive.value = false;

  if (!inputText.value.length) {
    emits('removeUser');
  }
}, 150);

const getFoundUsers = debounce(async () => {
  isLoading.value = true;

  try {
    const response = await searchUser(inputText.value.trim());

    if (response.status === 200) {
      userList.value = response.data.data;
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
}, 200);

watch(inputText, getFoundUsers);
</script>

<template>
  <div class="select">
    <label
      v-if="selectLabel"
      :for="`select-${selectLabel}`"
      class="select__label"
      >{{ selectLabel }} <span>*</span>
    </label>

    <input
      :id="selectLabel ? `select-${selectLabel}` : ''"
      type="search"
      :placeholder="isTable ? 'Select' : 'Select Substitute'"
      required
      :class="isTable ? 'select__input--is-table' : 'select__input'"
      v-model="inputText"
      ref="select"
      @focus="isActive = true"
      @blur="handleBlur"
      @keyup.esc="handleEscClick"
    />

    <IconChevronFillBottom
      :class="isTable ? 'select__icon--is-table' : 'select__icon'"
    />

    <div
      :class="
        isTable
          ? 'select__dropdown-wrapper--is-table'
          : 'select__dropdown-wrapper'
      "
    >
      <div class="dropdown" v-if="isActive && inputText.length">
        <div
          :class="isTable ? 'dropdown__empty--is-table' : 'dropdown__empty'"
          v-if="!userList.length"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>No users found</span>
        </div>
        <ul class="dropdown__list" v-else>
          <li
            :class="isTable ? 'dropdown__item--is-table' : 'dropdown__item'"
            v-for="user in userList"
            :key="user.id"
          >
            <a
              :class="isTable ? 'dropdown__link--is-table' : 'dropdown__link'"
              @click="handleLinkClick(user)"
              >{{ user.fullName }}</a
            >
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.select {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 2px;

  &__label {
    font-size: 13px;
    font-weight: 500;
    color: #1d245280;

    span {
      color: #f5455a;
    }
  }

  &__input {
    padding: 6px 28px 6px 8px;

    width: 320px;

    border-radius: 8px;
    border: 1px solid #1d24524d;

    color: #1d2452;
    font-size: 14px;
    font-weight: 500;

    cursor: pointer;

    &::placeholder {
      color: #1d245240;
      opacity: 1;
    }

    &--is-table {
      padding: 11px 44px 12px 16px;

      width: 100%;

      border: none;

      color: #1d2452;
      font-size: 14px;
      font-weight: 500;

      cursor: pointer;

      &::placeholder {
        color: #1d245280;
        opacity: 1;
      }
    }
  }

  &__icon {
    position: absolute;
    right: 8px;
    top: 30px;

    cursor: pointer;

    &--is-table {
      position: absolute;
      right: 16px;
      top: 16px;

      cursor: pointer;
    }
  }

  &__dropdown-wrapper {
    z-index: 5;
    position: absolute;
    left: 0;
    top: 46px;
    right: 0;

    box-shadow: 0 1px 2px #555b7d80;
    border-radius: 8px;

    &--is-table {
      z-index: 5;
      position: absolute;
      left: 0;
      top: 39px;
      right: 0;

      box-shadow: 0 1px 2px #555b7d80;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
}

.dropdown {
  max-height: 350px;

  overflow: auto;

  &__empty {
    background-color: #fff;
    border: 1px solid #1d24524d;
    border-radius: 8px;

    padding: 6px 8px;
    color: #1d2452;

    &--is-table {
      background-color: #fff;
      border: 1px solid #1d24524d;
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;

      padding: 11px 16px;
      color: #1d2452;
    }
  }

  &__item {
    background-color: #fff;

    &:first-child {
      border: 1px solid #1d24524d;
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }

    &:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }

    &--is-table {
      background-color: #fff;
      border: 1px solid #1d24524d;

      &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }

  &__item:not(:first-child) {
    border-left: 1px solid #1d24524d;
    border-right: 1px solid #1d24524d;
    border-bottom: 1px solid #1d24524d;
  }

  &__link {
    display: flex;
    padding: 6px 8px;
    color: #1d2452;

    transition: all 300ms;

    &:hover {
      transition: all 300ms;

      background-color: #9398c333;
      cursor: pointer;
    }

    &--is-table {
      display: flex;
      padding: 11px 16px;
      color: #1d2452;

      transition: all 300ms;

      &:hover {
        transition: all 300ms;

        background-color: #9398c333;
        cursor: pointer;
      }
    }
  }
}
</style>
