<template>
  <div>
    <PopupComponent v-if="popupOpen" @closed="popupOpen = false">
      <TabbedContainer
        :tabs="tabNames"
        class="py-5 px-8"
        v-if="!showRestrictedMenu"
      >
        <template v-slot:[0]>
          <TagSequencePopupTab :tags="[]" @confirmed="popupOpen = false" />
        </template>
        <template v-slot:[1]>
          <DeleteSequencePopup
            @deleted="confirmDeletion()"
            :sequence="sequence"
          />
        </template>
        <template v-slot:[2]>
          <ShareSequencePopupTab :sequence="sequence" />
        </template>
        <template v-slot:[3]>
          <SequenceDataPopupTab :sequence="sequence" />
        </template>
      </TabbedContainer>
      <TabbedContainer :tabs="[tabNames[3]]" class="py-5 px-8" v-else>
        <template v-slot:[0]>
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
import { PropType, ref } from 'vue';
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
   * Whether to show the restricted menu (only share with participants) for a sequence
   */
  showRestrictedMenu: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emits = defineEmits([
  /**
   * Triggers SequenceOverview to reload sequences
   */
  'reloadSequences',
]);

const popupOpen = ref(false);

const tabNames = [
  'Sequenz Taggen',
  'Sequenz löschen',
  'Sequenz mit Lehrkräften teilen',
  'Sequenz mit Teilnehmern teilen',
];

/**
 * Closes popup after deletion and emits event for sequence reloading
 */
function confirmDeletion(): void {
  popupOpen.value = false;
  emits('reloadSequences');
}
</script>
