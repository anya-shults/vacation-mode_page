<script setup>
import { ref, toRaw, watch } from 'vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const emits = defineEmits(['setDates']);

const date = ref();

const format = (dates) => {
  const day = dates[0]?.getDate();
  const month = dates[0]?.getMonth() + 1;
  const year = dates[0]?.getFullYear();
  const secondDay = dates[1]?.getDate();
  const secondMonth = dates[1]?.getMonth() + 1;
  const secondYear = dates[1]?.getFullYear();

  return `From ${year}-${month}-${day} to ${secondYear}-${secondMonth}-${secondDay}`;
};

const transition = {
  open: 'open',
  close: 'close',
};

watch(date, () => {
  if (!date.value?.length) {
    emits('setDates', null, null);

    return;
  }

  const selectedDates = toRaw(date.value);
  const start = new Date(selectedDates[0]);
  const end = new Date(selectedDates[1]);

  emits(
    'setDates',
    Math.round(start.getTime() / 1000),
    Math.round(end.getTime() / 1000),
  );
});
</script>

<template>
  <VueDatePicker
    v-model="date"
    range
    :transitions="transition"
    :format="format"
    :enable-time-picker="false"
    input-class-name="dp-custom-input"
    placeholder="From yyyy-mm-dd to yyyy-mm-dd"
    class="datepicker"
  />
</template>

<style lang="scss">
.datepicker {
  width: 285px;

  @media (max-width: 596px) {
    width: 100%;
  }
}

.dp-font-family {
  font-family: Inter;
}

.dp__input_wrap {
  box-sizing: border-box;
}

.dp-custom-input {
  font-size: 14px;
  font-weight: 400;
  color: #1d2452;
}

.dp__theme_light {
  --dp-background-color: #fff;
  --dp-text-color: #1d2452;
  --dp-hover-color: #1d24521a;
  --dp-hover-text-color: #1d2452;
  --dp-hover-icon-color: #1d2452;
  --dp-primary-color: #1c2452;
  --dp-primary-disabled-color: #9398c3;
  --dp-border-color: #1d24521a;
  --dp-border-color-hover: #aaaeb7;
  --dp-border-color-focus: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #1d2452;
  --dp-icon-color: #1d2452;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
}
</style>
