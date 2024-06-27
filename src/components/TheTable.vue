<script setup>
import { onMounted, ref } from 'vue';
import Number from './TheNumber.vue';
import TheSelect from './TheSelect.vue';
import { getTableData } from '../api/tableData';
import { useBackupApproversStore } from '../stores/backupApprovers';

let tableApprovalSteps = [];
let tableDocuments = [];
let tableData = [];

let isLoading = ref(false);

const backupApprovers = useBackupApproversStore();

const handleSetApprover = (user, step) => {
  backupApprovers.setApprover({
    id: step.id,
    backupApproverId: user.id,
  });
};

const handleRemoveApprover = (step) => {
  backupApprovers.removeApprover(step.id);
};

const findDocument = (documentId) => {
  const foundedDocument = tableDocuments.find((doc) => doc.id === documentId);

  if (!foundedDocument) {
    return null;
  }

  tableDocuments = tableDocuments.filter(
    (doc) => doc.id !== foundedDocument.id,
  );

  return foundedDocument.name;
};

let lastStep = (documentId) => {
  return tableData.filter((step) => step.documentId === documentId).length;
};

onMounted(async () => {
  isLoading.value = true;

  try {
    const response = await getTableData();

    if (response.status === 200) {
      tableApprovalSteps = response.data.data.approvalSteps;

      tableDocuments = response.data.data.documents.filter((doc) =>
        tableApprovalSteps.find((step) => step.documentId === doc.id),
      );

      tableData = tableApprovalSteps.map((step) => {
        return {
          ...step,
          documentName: findDocument(step.documentId),
        };
      });
    }
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="loading" v-if="isLoading">Loading...</div>
  <div class="no-data" v-else-if="!isLoading && !tableData.length">No data</div>

  <table class="table" v-else>
    <tr class="table__header">
      <th>Document</th>
      <th>Approval Step</th>
      <th>Backup Approval</th>
    </tr>

    <template v-for="(step, index) in tableData" :key="step.id">
      <tr
        class="table__empty-row"
        v-if="index !== 0 && step.stepNumber === 1"
      ></tr>

      <tr :class="{ table__row: step.documentName }">
        <td :class="step.documentName ? 'table__left-item' : 'table__empty'">
          {{ step.documentName }}
        </td>

        <td
          :class="{
            'table__center-item':
              lastStep(step.documentId) === step.stepNumber &&
              lastStep(step.documentId) !== 1,
          }"
        >
          <Number :number="+step.stepNumber" />
          {{ step.stepName }}
        </td>

        <td
          class="table__select"
          :class="{
            'table__right-top-item': step.stepNumber === 1 && index !== 0,
            'table__right-bottom-item':
              lastStep(step.documentId) === step.stepNumber,
          }"
        >
          <TheSelect
            :is-table="true"
            @get-user="(user) => handleSetApprover(user, step)"
            @remove-user="handleRemoveApprover(step)"
          />
        </td>
      </tr>
    </template>
  </table>
</template>

<style scoped lang="scss">
.loading {
  display: flex;
  justify-content: center;

  color: #1d2452;
}

.no-data {
  display: flex;
  justify-content: center;

  color: #1d2452;
}

.table {
  width: 100%;

  &__header {
    text-align: left;

    th {
      box-sizing: border-box;
      color: #555b7d;
      font-size: 12px;
      font-weight: 500;

      padding-block: 5px;

      background-color: #eceefb;
      border-top: 1px solid #eceefb;
    }

    th:not(:first-child) {
      border-left: 1px solid #1d24520d;
      width: 39%;
    }

    th:first-child {
      border-top-left-radius: 10px;
      border-left: 1px solid #eceefb;
    }

    th:last-child {
      border-top-right-radius: 10px;
      border-right: 1px solid #eceefb;
    }
  }

  td {
    border-left: 1px solid #eceefb;
    border-bottom: 1px solid #eceefb;

    padding-top: 11px;
    padding-bottom: 12px;

    color: #1d2452;
  }

  tr td:nth-last-of-type(2) {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  tr:nth-of-type(2) td:first-of-type {
    border-top-left-radius: 0;
  }

  &__row td {
    border-top: 1px solid #eceefb;
  }

  tr td:last-of-type {
    border-right: 1px solid #eceefb;
    padding: 0;
  }

  &__left-item {
    font-weight: 500;
    border-bottom-left-radius: 8px;
    border-top-left-radius: 8px;
  }

  tr &__empty {
    border: none;
  }

  &__empty-row {
    height: 20px;
    border: none;
  }

  &__center-item {
    border-bottom-left-radius: 8px;
  }

  &__right-top-item {
    border-top-right-radius: 8px;
  }

  &__right-bottom-item {
    border-bottom-right-radius: 8px;
  }
}
</style>
