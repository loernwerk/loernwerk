<!-- Component for inputing text -->
<template>
  <InteractableComponent class="!cursor-default">
    <input
      :type="hidden ? 'password' : 'text'"
      :maxLength="maxLength"
      :placeholder="placeHolder"
      :disabled="disabled"
      :value="props.input"
      class="cursor-pointer w-full placeholder:text-gray-500"
      :class="{ uppercase: uppercase }"
      @input="(event) => updateValue(event.target.value)"
    />
    <!--Note: VSCode will show that event.target.value dont exists, but it does-->
  </InteractableComponent>
</template>

<script setup lang="ts">
import InteractableComponent from './InteractableComponent.vue';

const props = defineProps({
  /**
   * The placeholder text for the input
   */
  placeHolder: {
    type: String,
    required: false,
    default: '',
  },

  /**
   * The maximum length of the input
   */
  maxLength: {
    type: Number,
    required: false,
    // This is the default maxLength of an input element
    default: 524288,
  },

  /**
   * Whether the input should be hidden
   */
  hidden: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Wheter the input should displayed uppercase
   */
  uppercase: {
    type: Boolean,
    required: false,
    default: false,
  },

  /**
   * Wheter the input is disabled during loading
   */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /**
   *
   */
  input: String,
});

const emit = defineEmits([
  /**
   * Event for when the input was changed
   *
   * @param inputText The text in the input
   */
  'update:input',
]);

/**
 * The update function, that updates the v-mode input var
 * @param value the new value
 */
function updateValue(value: string): void {
  emit('update:input', value);
}
</script>
