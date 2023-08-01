<template>
  <slot></slot>
  <div class="relative">
    <div class="absolute bottom-0 right-0">
      <ul class="list-image-none">
        <li v-for="mes of errormessages" :key="mes">mes</li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, ref, Ref } from 'vue';

const errormessages: Ref<Array<string>> = ref([]);

onErrorCaptured((err, instance, info) => {
  void instance;
  errormessages.value.push(err.message);
  console.log(errormessages.value);
  console.log('this needed to be displayed, err:' + err + ' info: ' + info);
  return false;
});
</script>
