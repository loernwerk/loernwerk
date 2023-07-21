<!-- Displays a text content -->
<template>
  <div class="h-full">
    <div id="editor" class="h-full" ref="editorDiv"></div>
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
const Delta = Quill.import('delta');

onMounted(() => {
  const qlColors = Quill.import('attributors/style/color');
  const qlSizes = Quill.import('attributors/style/size');
  const qlFonts = Quill.import('attributors/style/font');
  const qlAlign = Quill.import('attributors/style/align');
  qlColors.whitelist = colors;
  qlSizes.whitelist = sizes;
  qlFonts.whitelist = fontFamilies;
  qlAlign.whitelist = ['left', 'center', 'right'];

  Quill.register(qlColors, true);
  Quill.register(qlSizes, true);
  Quill.register(qlAlign, true);
  Quill.register(qlFonts, true);

  const realEditorDiv = editorDiv.value;
  if (!realEditorDiv) {
    return;
  }

  const quill = new Quill(realEditorDiv, {
    modules: {
      toolbar: {
        container: `#q-toolbar-${props.layoutSlot.toString()}`,
      },
    },
    readOnly: !props.editMode,
  });

  quill.setContents(new Delta(props.textContent.delta), 'api');

  quill.on('text-change', () => {
    emits('editing', quill.getContents());
  });

  watch(
    () => props.textContent,
    () => {
      if (props.textContent.delta == quill.getContents()) {
        return;
      }

      quill.setContents(new Delta(props.textContent.delta), 'api');
    }
  );

  realEditorDiv.onclick = (): void => {
    emits('editing', quill.getContents());
  };
});
</script>

<style>
.ql-editor {
  height: 100%;
  white-space: pre-wrap;
  overflow: scroll;
}

.ql-container {
  font-size: 14px;
  font-family: Arial;
  color: black;
}

/* Weird element that Quill adds, style fetched from quills snow-theme */
.ql-clipboard {
  left: -100000px;
  height: 1px;
  overflow-y: hidden;
  position: absolute;
  top: 50%;
}
</style>
