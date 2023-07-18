<template>
  <div>
    <PopupComponent v-if="popupOpen" @closed="closeAndReload()">
      <TabbedContainer
        :possible-tabs="tabNames"
        :shown-tabs="shownTabs"
        class="py-5 px-8"
      >
        <template v-slot:[tabName(0)]>
          <TagSequencePopupTab :tags="[]" @confirmed="closeAndReload()" />
        </template>
        <template v-slot:[tabName(1)]>
          <DeleteSequencePopup
            @deleted="closeAndReload()"
            :sequence="sequence"
          />
        </template>
        <template v-slot:[tabName(2)]>
          <ShareSequencePopupTab :sequence="sequence" />
        </template>
        <template v-slot:[tabName(3)]>
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
import { PropType, computed, ref } from 'vue';
import TabbedContainer from '../TabbedContainer.vue';
import SequenceDataPopupTab from '../PopupTabs/SequenceDataPopupTab.vue';
import DeleteSequencePopup from '../PopupTabs/DeleteSequencePopup.vue';
import ShareSequencePopupTab from '../PopupTabs/ShareSequencePopupTab.vue';
import TagSequencePopupTab from '../PopupTabs/TagSequencePopupTab.vue';

const props = defineProps({
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
  'Schlüsselwörter verwalten',
  'Löschen',
  'Mit Lehrkräften teilen',
  'Mit Teilnehmern teilen',
];

const shownTabs = computed(() => {
  if (props.showRestrictedMenu) {
    return [tabNames[3]];
  } else {
    return tabNames;
  }
});

/**
 * Returns name of specified tab
 * @param index index of specified tab
 * @returns tab name
 */
function tabName(index: number): string {
  return tabNames[index];
}

/**
 * Closes popup and emits event for sequence reloading
 */
function closeAndReload(): void {
  popupOpen.value = false;
  emits('reloadSequences');
}
</script>
