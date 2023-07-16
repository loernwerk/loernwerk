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
import { PropType, Ref, onMounted, ref, watch } from 'vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import Quill from 'quill';
import { colors, sizes, fontFamilies } from './DesignOptions';
import { LayoutSlot } from '../../../../model/slide/layout/Layout';

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
  /**
   * The slot this display is in
   */
  layoutSlot: {
    type: Number as PropType<LayoutSlot>,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emitted when the content is being edited
   *
   * @param val Content of the editor
   */
  'editing',
]);
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
  const qlFonts = Quill.import('attributors/style/font');
  qlColors.whitelist = colors;
  qlSizes.whitelist = sizes;
  qlFonts.whitelist = fontFamilies;

  Quill.register(qlColors, true);
  Quill.register(qlSizes, true);
  Quill.register(Quill.import('attributors/style/align'), true);
  Quill.register(qlFonts, true);

  const realEditorDiv = editorDiv.value;
  if (!realEditorDiv) {
    return;
  }

  editor.value = new Quill(realEditorDiv, {
    modules: {
      toolbar: {
        container: `#q-toolbar-${props.layoutSlot.toString()}`,
      },
    },
    readOnly: !props.editMode,
  });

  // requiere vs import is an issue here
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  editor.value.setContents(props.textContent.delta, 'api');

  editor.value.on('text-change', () => {
    emits('editing', editor.value?.getContents());
  });
});

watch(
  () => props.textContent,
  () => {
    if (editor.value === null) {
      return;
    }
    if (props.textContent.delta == editor.value.getContents()) {
      return;
    }

    // requiere vs import is an issue here
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    editor.value.setContents(props.textContent.delta, 'api');
  }
);
</script>

<style>
.ql-editor {
  height: 100%;
}

.ql-container {
  font-size: 14px;
  font-family: Arial;
}
</style>
