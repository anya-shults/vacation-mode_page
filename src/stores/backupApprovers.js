import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useBackupApproversStore = defineStore('backupApprovers', () => {
  /**
   * @type {{
   *  id: Number,
   *  backupApproverId: Number,
   * }[]}
   */
  let approvers = ref([]);

  const getApprovers = computed(() => approvers.value);

  /**
   *
   * @param { Number } removedApproverId
   */
  function removeApprover(removedApproverId) {
    approvers.value = approvers.value.filter(
      (approver) => approver.id !== removedApproverId,
    );
  }

  /**
   *
   * @param {{
   *  id: Number,
   *  backupApproverId: Number,
   * }} newApprover
   */
  function setApprover(newApprover) {
    /**
     * @type {{
     *  id: Number,
     *  backupApproverId: Number,
     *  backupApproverMail: String,
     * }}
     */
    const foundApprover = approvers.value.find(
      (approver) => approver.id === newApprover.id,
    );

    if (foundApprover) {
      removeApprover(newApprover.id);
    }

    approvers.value.push(newApprover);
  }

  return {
    approvers,
    getApprovers,
    removeApprover,
    setApprover,
  };
});
