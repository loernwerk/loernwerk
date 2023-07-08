<template>
  <div class="w-full mt-auto mb-auto ml-3 mr-3">
    <Suspense>
      <AccountDetailsEditContainer :showadminview="true" :user="originalUser" />
    </Suspense>
  </div>
</template>

<script setup lang="ts">
import {
  LoernwerkError,
  LoernwerkErrorCodes,
} from '../../../backend/loernwerkError';
import { IUser, UserClass } from '../../../model/user/IUser';
import AccountDetailsEditContainer from '../components/AccountDetailsEditContainer.vue';
import { AccountRestInterface } from '../restInterfaces/AccountRestInterface';
import { router } from '../router';
let originalUser: Partial<IUser>;
try {
  originalUser = await AccountRestInterface.getOwnAccount();
} catch (e) {
  if (e instanceof LoernwerkError) {
    if (e.code === LoernwerkErrorCodes.UNAUTHORIZED) {
      router.push('LogIn');
    } else if (e.code === LoernwerkErrorCodes.FORBIDDEN) {
      originalUser = { type: UserClass.REGULAR }; //TODO: Show error insted accountdetailseditcontainer
    } else {
      throw e;
    }
  } else {
    throw e;
  }
}
</script>
