<template>
  <div>
    <PopupComponent v-if="popupOpen" @closed="closeAndReload()">
      <TabbedContainer
        :possible-tabs="tabNames"
        :shown-tabs="shownTabs"
        class="py-10 px-10 h-80"
      >
        <template v-slot:[tabName(0)]>
          <TagSequencePopupTab
            :sequence="sequence"
            @confirmed="closeAndReload()"
          />
        </template>
        <template v-slot:[tabName(1)]>
          <DeleteSequencePopupTab
            @deleted="closeAndReload()"
            :sequence="sequence"
          />
        </template>
        <template v-slot:[tabName(2)]>
          <ShareSequencePopupTab :sequence="sequence" />
        </template>
        <template v-slot:[tabName(3)]>
          <DataSequencePopupTab :sequence="sequence" />
        </template>
      </TabbedContainer>
    </PopupComponent>

    <ContainerComponent>
      <div class="space-y-2">
        <h3 class="text-3xl text-center">{{ sequence.name }}</h3>
        <div
          class="flex flex-row space-x-2 flex-wrap"
          v-if="sequence.authorId === ownId"
        >
          <div
            v-for="(tag, index) in sequence.tags"
            class="border-1 rounded bg-green-200 px-1 box-border"
            :key="index"
          >
            {{ tag }}
          </div>
        </div>
        <div v-if="sequence.authorId != ownId" class="text-xs">
          {{
            sequence.readAccess.includes(ownId)
              ? 'Lesezugriff'
              : 'Schreibzugriff'
          }}
        </div>
        <div class="flex flex-row space-x-2">
          <ButtonComponent
            class="flex-1"
            @click="
              router.push({
                name:
                  sequence.authorId == ownId ||
                  sequence.writeAccess.includes(ownId)
                    ? 'SequenceEdit'
                    : 'Slide',
                params: { code: sequence.code },
              })
            "
            >{{
              sequence.authorId == ownId || sequence.writeAccess.includes(ownId)
                ? 'Bearbeiten'
                : 'Ansehen'
            }}
          </ButtonComponent>
          <ButtonComponent class="" @click="popupOpen = !popupOpen">
            <FontAwesomeIcon :icon="['fas', 'ellipsis']" />
          </ButtonComponent>
        </div>
      </div>
    </ContainerComponent>
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from './ButtonComponent.vue';
import { ISequence } from '../../../model/sequence/ISequence';
import ContainerComponent from './ContainerComponent.vue';
import { router } from '../router';
import PopupComponent from './PopupComponent.vue';
import { PropType, computed, ref } from 'vue';
import TabbedContainer from './TabbedContainer.vue';
import DeleteSequencePopupTab from './PopupTabs/DeleteSequencePopupTab.vue';
import DataSequencePopupTab from './PopupTabs/DataSequencePopupTab.vue';
import ShareSequencePopupTab from './PopupTabs/ShareSequencePopupTab.vue';
import TagSequencePopupTab from './PopupTabs/TagSequencePopupTab.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEllipsis } from '@fortawesome/free-solid-svg-icons';

library.add(faEllipsis);

const props = defineProps({
  /**
   * Sequence which should be previewed
   */
  sequence: {
    type: Object as PropType<ISequence>,
    required: true,
  },

  /**
   * Id of account that displays the sequence
   */
  ownId: {
    type: Number,
    required: true,
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
  'Schlüsselwörter',
  'Löschen',
  'Mit Lehrkräften teilen',
  'Mit Teilnehmern teilen',
];

const shownTabs = computed(() => {
  if (props.sequence?.authorId === props.ownId) {
    return tabNames;
  } else {
    return [tabNames[3]];
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