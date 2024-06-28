import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useSubstituteUserStore = defineStore('substituteUser', () => {
  /**
   * @type { Number | null }
   */
  const id = ref(null);
  /**
   * @type { String }
   */
  const mail = ref('');

  const getUserId = computed(() => id);
  const getUserMail = computed(() => mail);

  function setUserId(newId) {
    id.value = newId;
  }

  function setUserMail(newMail) {
    mail.value = newMail;
  }

  function removeUser() {
    id.value = null;
    mail.value = '';
  }

  return {
    id,
    mail,
    getUserId,
    getUserMail,
    setUserId,
    setUserMail,
    removeUser,
  };
});
