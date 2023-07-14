<template>
  <ContainerComponent>
    <TextInputComponent
        @input-changed="(text) => (tagField = text)"
        :class="{ 'border-red-600': showRedBorder }"
    />
    <ButtonComponent @click="confirmTagging()">Confirm</ButtonComponent>
  </ContainerComponent>
</template>

<script setup lang="ts">
import ContainerComponent from '../ContainerComponent.vue';
import TextInputComponent from "../TextInputComponent.vue";
import ButtonComponent from "../ButtonComponent.vue";
import useEventsBus from "../../eventBus";
import {ref} from "vue";
import {ISequence} from "../../../../model/sequence/ISequence";
const { emit }=useEventsBus();

const props = defineProps({
  sequenceToBeTagged: Object as () => ISequence,
})
let tagField = ref('');
let showRedBorder = ref(false);
function confirmTagging() {
  if(tagField.value.length == 0) {
    emit('tagEmpty');
    showRedBorder.value=true;
  } else {
    showRedBorder.value = false;
    props.sequenceToBeTagged?.keywords.push(tagField.value)
    emit('confirmAddTag');
  }

}

</script>


<style scoped></style>
