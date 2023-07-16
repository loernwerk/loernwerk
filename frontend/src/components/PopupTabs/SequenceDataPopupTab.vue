<template>
  <ContainerComponent>
  <h3>Der Code der ausgewählten Sequenz ist : {{ sequenceData.code }}</h3>
  <h3>Der Link zur momentan ausgewählten Sequenz ist: {{ link }}</h3>
  </ContainerComponent>
</template>

<script setup lang="ts">
import {toRaw, watch} from "vue";
import useEventsBus from "../../eventBus";
import {SequenceRestInterface} from "../../restInterfaces/SequenceRestInterface";
import ContainerComponent from "../ContainerComponent.vue";
const { bus } = useEventsBus();
let sequenceData;
//let link = SequenceRestInterface.getSequence(sequenceData.code);
let link = 'someUrl';
watch(()=>bus.value.get('sequence'), (sequence) => {
  sequenceData = toRaw(sequence)[0];
});

</script>