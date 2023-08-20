<template>
    <QuillToolBar :id="layoutSlot.toString()" />
    <TextDisplay
        :textContent="textContent"
        :editMode="editMode"
        :layout-slot="layoutSlot"
    />
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import QuillToolBar from '../../../frontend/src/components/sequenceEditOptionsTab/QuillToolBar.vue';
import TextDisplay from '../../../frontend/src/components/contentDisplay/TextDisplay.vue';
import { LayoutSlot } from '../../../model/slide/layout/Layout';
import { TextContent } from '../../../model/slide/content/TextContent';

defineProps({
    layoutSlot: {
        type: Number as PropType<LayoutSlot>,
        required: true,
    },
    textContent: {
        type: TextContent,
        required: true,
    },
    editMode: {
        type: Boolean,
        required: true,
    },
});
</script>
