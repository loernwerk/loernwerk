<!-- Displays a text content -->
<template>
  <div
    class="h-full overflow-hidden flex flex-col"
    :class="{ textAlign, justify, items }"
  >
    <div
      v-for="[index, line] in lines.entries()"
      :key="index"
      class="flex flex-row items-center"
    >
      <div
        v-for="[index2, snippet] in line.entries()"
        :key="index2"
        :class="{
          bold: snippet.options.bold,
          italic: snippet.options.italic,
          underline: snippet.options.underlined,
        }"
        class="break-words whitespace-pre-wrap"
        :style="{
          color: snippet.options.color,
          fontSize: `${Math.round(snippet.options.size * pxPerPoint)}px`,
          fontFamily: snippet.options.font,
        }"
      >
        {{ snippet.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, Ref, watch, inject, ref } from 'vue';
import { TextContent } from '../../../../model/slide/content/TextContent';
import { TextSnippet } from '../../../../model/slide/content/TextSnippet';

const props = defineProps({
  /**
   * The embed content to display
   */
  textContent: {
    type: Object as PropType<TextContent>,
    required: true,
  },
});

// responsive font size
const slideHeight = inject('slideHeight') as Ref<number>;
const pxPerPoint = ref(0);
watch(slideHeight, () => {
  pxPerPoint.value = slideHeight.value / 350;
});

// calculate alignment of text
const textAlign = ref('text-left');
const justify = ref('justify-start');
const items = ref('items-start');
switch (props.textContent.alignmentHorizontal) {
  case 'left':
    textAlign.value = 'text-left';
    justify.value = 'justify-start';
    break;
  case 'center':
    textAlign.value = 'text-center';
    justify.value = 'justify-center';
    break;
  case 'right':
    textAlign.value = 'text-right';
    justify.value = 'justify-end';
    break;
}
switch (props.textContent.alignmentVertical) {
  case 'top':
    items.value = 'items-start';
    break;
  case 'center':
    items.value = 'items-center';
    break;
  case 'bottom':
    items.value = 'items-end';
    break;
}

// Each line is an array of text snippets
const lines: TextSnippet[][] = [[]];
// split text into lines
for (const snippet of props.textContent.textSnippets) {
  if (snippet.text.includes('\n')) {
    const splits = snippet.text.split('\n');
    for (let i = 0; i < splits.length - 1; i++) {
      lines[lines.length - 1].push({
        text: splits[i],
        options: snippet.options,
      });
      lines.push([]);
    }
    lines[lines.length - 1].push({
      text: splits[splits.length - 1],
      options: snippet.options,
    });
  } else {
    lines[lines.length - 1].push(snippet);
  }
}
// clean up empty texts and print empty lines
for (const line of lines) {
  if (line.length > 1 && line[0].text === '') {
    line.shift();
  }
  if (line.length === 1 && line[0].text === '') {
    line[0].text = ' ';
  }
}
console.log(lines);
</script>
