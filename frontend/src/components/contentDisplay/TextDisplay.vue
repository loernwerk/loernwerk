<!-- Displays a text content -->
<template>
  <div class="h-full">
    <div id="editor" class="h-full" ref="editorDiv"></div>
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

  const editor = new Quill(realEditorDiv, {
    modules: {
      toolbar: {
        container: '#toolbar',
      },
    },
    readOnly: !props.editMode,
  });

  editor.setContents(props.textContent.delta);

  editor.on('text-change', () => {
    emits('editing', editor.getContents());
  });
});
</script>

<style lang="postcss">
.ql-editor {
  height: 100%;
}
</style>
