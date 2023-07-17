<template>
  <div>
    <PopupComponent v-if="popupOpen" @close="popupOpen = false">
      <TabbedContainer :tabs="tabNames">
        <template v-slot:[0]>
          <TagSequencePopupTab />
        </template>
        <template v-slot:[1]>
          <DeleteSequencePopup
            :sequence="sequence"
            :allSequences="allSequences"
          />
        </template>
        <template v-slot:[2]>
          <ShareSequencePopupTab />
        </template>
        <template v-slot:[3]>
          <SequenceDataPopupTab :sequence="sequence" />
        </template>
      </TabbedContainer>
    </PopupComponent>

    <ContainerComponent>
      <h3>{{ sequence.name }}</h3>
      <div class="flex flex-row">
        <ButtonComponent class="basis-1/2 mr-2" @click="router.push('LogIn')"
          >Bearbeiten
        </ButtonComponent>
        <ButtonComponent class="basis-1/2" @click="popupOpen = !popupOpen"
          >Menü</ButtonComponent
        >
      </div>
      <div class="Popup"></div>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from '../ButtonComponent.vue';
import { ISequence } from '../../../../model/sequence/ISequence';
import ContainerComponent from '../ContainerComponent.vue';
import { router } from '../../router';
import PopupComponent from '../PopupComponent.vue';
import { PropType, ref, watch } from 'vue';
import useEventsBus from './../../eventBus';
import TabbedContainer from '../TabbedContainer.vue';
import SequenceDataPopupTab from '../PopupTabs/SequenceDataPopupTab.vue';
import DeleteSequencePopup from '../PopupTabs/DeleteSequencePopup.vue';
import ShareSequencePopupTab from '../PopupTabs/ShareSequencePopupTab.vue';
import TagSequencePopupTab from '../PopupTabs/TagSequencePopupTab.vue';

defineProps({
  /**
   * Sequence which should be previewed
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },
  /**
   * All sequences which should be displayed
   */
  allSequences: {
    type: Array<ISequence>,
    required: true,
  },
});

const popupOpen = ref(false);

const tabNames = [
  'Sequenz Taggen',
  'Sequenz löschen',
  'Sequenz mit Lehrkräften teilen',
  'Sequenz mit Teilnehmern teilen',
];

const { bus } = useEventsBus();

watch(
  () => bus.value.get('canBeClosed'),
  () => {
    popupOpen.value = false;
  }
);
</script>
