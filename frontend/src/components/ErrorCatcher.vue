<template>
  <slot></slot>
  <div class="relative">
    <div class="absolute bottom-0 right-0 w-40">
      <ul class="list-image-none">
        <li v-for="mes of errormessages" :key="mes">
          <Toast :message="mes" :time="errortimedisplayed" />
        </li>
      </ul>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onErrorCaptured, ref, Ref } from 'vue';
import Toast from './ToastComponent.vue';

const errormessages: Ref<Array<string>> = ref([]);
const errortimedisplayed = 3000;

onErrorCaptured((err, instance, info) => {
  void instance;
  errormessages.value.push(err.message);
  console.log(errormessages.value);
  console.log('this needed to be displayed, err:' + err + ' info: ' + info);
  setTimeout(() => {
    const i = errormessages.value.indexOf(err.message);
    errormessages.value.splice(i, 1);
  }, errortimedisplayed);
  return false;
});
</script>
