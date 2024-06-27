<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  toRaw,
  watch,
} from 'vue';

import TheHeader from './components/TheHeader.vue';
import Status from './components/TheStatus.vue';
import TheTable from './components/TheTable.vue';
import TheSelect from './components/TheSelect.vue';
import UpdatePopup from './components/UpdatePopup.vue';
import DatePicker from './components/DatePicker.vue';
import { useSubstituteUserStore } from './stores/substituteUser';
import { useBackupApproversStore } from './stores/backupApprovers';
import { updateForm } from './api/updateForm';

let isUpdated = ref(false);
let isUpdateError = ref(false);
let isUpdatePopupVisible = ref(false);
let enabled = ref(false);
let isLoading = ref(false);

const backupApproversLength = 8;

const request = reactive({
  startDate: null,
  endDate: null,
  substituteUser: null,
  backupApprovers: [],
});

const substituteUser = useSubstituteUserStore();
const backupApprovers = useBackupApproversStore();

const handleSetDates = (startDate, endDate) => {
  if (isUpdated.value) {
    isUpdated.value = false;
  }

  request.startDate = startDate;
  request.endDate = endDate;
};

const handleSetUser = (user) => {
  substituteUser.setUserId(user.id);
  substituteUser.setUserMail(user.email);
};

const handleRemoveUser = () => {
  substituteUser.removeUser();
};

const handleCloseUpdatePopup = () => {
  isUpdatePopupVisible.value = false;
};

const handleBeforeUnload = (event) => {
  if (!isUpdated.value && isNotEmptyField.value) {
    event.preventDefault();
  }
};

const handlePopstate = () => {
  if (!isUpdated.value && isNotEmptyField.value) {
    const confirmationMessage =
      'У вас залишились незбережені зміни. ' +
      'Ви впевнені, що хочете залишити цю сторінку?';
    const userResponse = confirm(confirmationMessage);

    if (!userResponse) {
      history.pushState(null, null, document.URL);
    }
  }
};

const addEventListeners = () => {
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('popstate', handlePopstate);
};

const removeEventListeners = () => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
  window.removeEventListener('popstate', handlePopstate);
};

const handleSubmit = async () => {
  if (!enabled.value) {
    return;
  }

  isLoading.value = true;

  try {
    const response = await updateForm({
      vacationMode: {
        enable: toRaw(enabled.value),
        startDate: request.startDate,
        endDate: request.endDate,
      },

      substituteUser: toRaw(request.substituteUser),
      backupApprovers: toRaw(request.backupApprovers),
    });

    if (response.status === 200 && response.data.ok) {
      isUpdateError.value = false;
      isUpdatePopupVisible.value = true;
      isUpdated.value = true;

      setTimeout(() => (isUpdatePopupVisible.value = false), 3000);
    }
  } catch (err) {
    console.error(err);
    isUpdateError.value = true;
  } finally {
    isLoading.value = false;
  }
};

const isNotEmptyFields = computed(() => {
  return Object.values(request).every((value) => {
    if (Array.isArray(value)) {
      return value.length;
    }

    return value;
  });
});

const isNotEmptyField = computed(() => {
  return Object.values(request).some((value) => {
    if (Array.isArray(value)) {
      return value.length;
    }

    return value;
  });
});

watch(substituteUser, () => {
  if (isUpdated.value) {
    isUpdated.value = false;
  }

  if (substituteUser.id) {
    request.substituteUser = substituteUser.id;
    return;
  }

  request.substituteUser = null;
});

watch(backupApprovers, () => {
  if (isUpdated.value) {
    isUpdated.value = false;
  }

  if (backupApprovers.approvers.length === backupApproversLength) {
    const approvers = toRaw(backupApprovers.approvers);

    request.backupApprovers = approvers;
    return;
  }

  request.backupApprovers = [];
});

watch(request, () => {
  const isResponseReady = isNotEmptyFields.value;

  if (isResponseReady) {
    enabled.value = true;
    return;
  }

  enabled.value = false;
});

onMounted(() => addEventListeners());
onBeforeUnmount(() => removeEventListeners());
</script>

<template>
  <TheHeader />

  <main>
    <UpdatePopup
      :is-visible="isUpdatePopupVisible"
      :is-error="isUpdateError"
      @close="handleCloseUpdatePopup"
      class="popup"
    />

    <form class="form" @submit.prevent="handleSubmit">
      <div class="form__header">
        <div class="container">
          <div class="form__header-wrapper">
            <h2>Vacation Mode Settings</h2>

            <div :class="{ 'form__button-wrapper': !enabled }">
              <a
                :class="enabled ? 'form__button' : 'form__button--disabled'"
                type="submit"
                :disabled="enabled"
                @click="handleSubmit"
              >
                Update
              </a>

              <div class="form__tooltip-wrapper">
                <div class="tooltip">
                  Choose Date, Substitute User and Backup Approver to enable
                  Vacation Mode
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="vacation-mode">
          <div class="vacation-mode__left">
            <div class="vacation-mode__header">
              <h3>Vacation mode</h3>

              <Status :is-enabled="enabled" />
            </div>

            <div class="description">
              Select Date, Substitute User and Backup Approver to Enable
              Vacation Mode.
            </div>
          </div>

          <div class="vacation-mode__right">
            <DatePicker @set-dates="handleSetDates" />
          </div>
        </div>

        <div class="substitute-user">
          <div class="substitute-user__left">
            <h3>Substitute User</h3>

            <div class="description">
              Performs approval actions while you are away.
            </div>
          </div>

          <div class="substitute-user__right">
            <TheSelect
              select-label="Substitute User"
              @get-user="handleSetUser"
              @remove-user="handleRemoveUser"
            />
          </div>
        </div>

        <div class="backup-approver">
          <div class="backup-approver__header">
            <h3>Backup Approver</h3>

            <div class="description">
              Performs approval actions while you are away. Below, you can
              select the necessary Approvers.
            </div>
          </div>

          <div class="backup-approver__table-wrapper">
            <TheTable />
          </div>
        </div>
      </div>
    </form>
  </main>
</template>

<style scoped lang="scss">
.popup {
  z-index: 5;
  position: absolute;
  right: 15px;
  top: 55px;
}

.form {
  &__header {
    border-bottom: 1px solid #1d24521a;

    &-wrapper {
      position: relative;

      display: flex;
      justify-content: space-between;
      align-items: center;

      padding: 14px 25px 15px 24px;
    }
  }

  &__button {
    color: #fff;
    font-weight: 600;
    border-radius: 20px;

    padding: 5.5px 16px;

    background-color: #1c2452;

    transition: 300ms background-color;

    &-wrapper {
      &:hover .form__tooltip-wrapper {
        transition: opacity 0.3s;

        visibility: visible;
        opacity: 1;
      }
    }

    &--disabled {
      transition: 300ms background-color;

      background-color: #9398c3;
      border-radius: 20px;
      font-weight: 600;

      padding: 5.5px 16px;

      cursor: not-allowed;
    }

    &:hover {
      transition: 300ms background-color;

      background-color: #162384;
      cursor: pointer;
    }
  }

  &__tooltip-wrapper {
    z-index: 4;
    position: absolute;
    right: 15px;
    top: 47px;

    visibility: hidden;
    opacity: 0;

    transition: opacity 0.3s;
  }
}

.tooltip {
  max-width: 227px;
  padding: 4px 6px;

  border-radius: 4px;
  background-color: #1d2452e6;

  color: #fff;
  font-size: 11px;

  &::before {
    content: '';
    position: absolute;
    bottom: 100%;
    right: 45px;

    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent transparent #1d2452e6 transparent;
  }
}

.vacation-mode {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-inline: 24px;
  padding: 24px 0 20px;

  border-bottom: 1px solid #415ada1a;

  &__left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__header {
    display: flex;
    align-items: center;
    gap: 6px;
  }
}

.substitute-user {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-inline: 24px;
  padding: 21px 0 26px;

  border-bottom: 1px solid #415ada1a;

  &__left {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}

.backup-approver {
  margin-inline: 24px;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 4px;

    padding: 20px 0 16px;
  }
}
</style>
