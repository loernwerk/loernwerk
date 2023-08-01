<template>
  <slot></slot>
  <div class="relative">
    <div class="absolute bottom-0 right-0">
      <li>
        <ul>
          Test
        </ul>
        <ul v-for="mes of errormessages" :key="mes">
          mes
        </ul>
        >
      </li>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, ref, Ref } from 'vue';

const errormessages: Ref<Array<string>> = ref([]);

onErrorCaptured((err, instance, info) => {
  void instance;
  errormessages.value.concat(err.message);
  console.log('this needed to be displayed, err:' + err + ' info: ' + info);
  return false;
});
</script>
