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
            @delete="closeAndReload()"
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
          v-if="sequence.authorId === userId"
        >
          <div
            v-for="(tag, index) in sequence.tags"
            class="border-1 rounded bg-green-200 px-1 box-border dark:bg-green-800 border-green-200 dark:border-green-800"
            :key="index"
          >
            {{ tag }}
          </div>
        </div>
        <div v-if="sequence.authorId != userId" class="text-xs">
          {{
            sequence.readAccess.includes(userId)
              ? $t('sequence.readAccess')
              : $t('sequence.writeAccess')
          }}
        </div>
        <div class="flex flex-row space-x-2">
          <ButtonComponent
            class="flex-1"
            @click="
              router.push({
                name:
                  sequence.authorId == userId ||
                  sequence.writeAccess.includes(userId)
                    ? 'SequenceEdit'
                    : 'Slide',
                params: { sequenceCode: sequence.code },
              })
            "
            >{{
              sequence.authorId == userId ||
              sequence.writeAccess.includes(userId)
                ? $t('edit')
                : $t('view')
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
import DeleteSequencePopupTab from './sequenceOverviewPopUpTabs/DeleteSequencePopupTab.vue';
import DataSequencePopupTab from './sequenceOverviewPopUpTabs/DataSequencePopupTab.vue';
import ShareSequencePopupTab from './sequenceOverviewPopUpTabs/ShareSequencePopupTab.vue';
import TagSequencePopupTab from './sequenceOverviewPopUpTabs/TagSequencePopupTab.vue';
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
  userId: {
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

const tabNames = computed(() => {
  return [
    'sequence.tags',
    'delete',
    'sequence.shareWithTeacher',
    'sequence.shareWithstudent',
  ] as string[];
});

const shownTabs = computed(() => {
  if (props.sequence?.authorId === props.userId) {
    return tabNames.value;
  } else {
    return [tabNames.value[3]];
  }
});

/**
 * Returns name of specified tab
 * @param index index of specified tab
 * @returns tab name
 */
function tabName(index: number): string {
  return tabNames.value[index];
}

/**
 * Closes popup and emits event for sequence reloading
 */
function closeAndReload(): void {
  popupOpen.value = false;
  emits('reloadSequences');
}
</script>
