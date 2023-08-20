<template>
    <Suspense>
        <ShareSequencePopupTab :sequence="sequence" />
    </Suspense>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import ShareSequencePopupTab from '../../../frontend/src/components/sequenceOverviewPopUpTabs/ShareSequencePopupTab.vue';
import { ISequence } from '../../../model/sequence/ISequence';

defineProps({
    sequence: {
        type: Object as PropType<ISequence>,
        required: true,
    },
});
</script>
