<!-- Displays a text content -->
<template>
  <div class="h-full">
    <div
      id="editor"
      class="h-full"
      ref="editorDiv"
      @click="emitEditing()"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, onMounted, ref } from 'vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import Quill from 'quill';
import { colors, sizes } from './DesignOptions';

const props = defineProps({
  /**
   * The embed content to display
   */
  textContent: {
    type: Object as PropType<TextContent>,
    required: true,
  },
  /**
   * Indicates whether student or teacher is viewing the slide
   */
  editMode: {
    type: Boolean,
    required: true,
  },
});

const emits = defineEmits(['editing']);
const editorDiv: Ref<HTMLDivElement | null> = ref(null);
const editor: Ref<Quill | null> = ref(null);

/**
 * Emits the editing event
 */
function emitEditing(): void {
  if (editor.value === null) {
    emits('editing', props.textContent.delta);
  } else {
    emits('editing', editor.value?.getContents());
  }
}

onMounted(() => {
  const qlColors = Quill.import('attributors/style/color');
  const qlSizes = Quill.import('attributors/style/size');
  qlColors.whitelist = colors;
  qlSizes.whitelist = sizes;

  console.log(qlColors, qlSizes);
  Quill.register(qlColors, true);
  Quill.register(qlSizes, true);
  Quill.register(Quill.import('attributors/style/align'), true);
  Quill.register(Quill.import('attributors/style/font'), true);

  const realEditorDiv = editorDiv.value;
  if (!realEditorDiv) {
    return;
  }

  editor.value = new Quill(realEditorDiv, {
    modules: {
      toolbar: {
        container: '#toolbar',
      },
    },
    readOnly: !props.editMode,
  });

  // requiere vs import is an issue here
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor.value.setContents(props.textContent.delta);

  editor.value.on('text-change', () => {
    emits('editing', editor.value?.getContents());
  });
});
</script>

<style lang="postcss">
.ql-editor {
  height: 100%;
}
</style>
