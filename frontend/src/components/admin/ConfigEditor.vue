<template>
  <div class="flex flex-col">
    <table class="h-fit">
      <tr v-for="key in keyOrder" :key="key">
        <td class="p-2">{{ keyDescribtion[key] }}:</td>
        <td class="p-2">
          <div
            v-if="ConfigTypeMap.getType(key).type === 'number'"
            class="flex space-x-2 items-center"
          >
            <InteractableComponent>
              <input type="number" v-model="model[key]" min="0" />
            </InteractableComponent>
            <i>Leer lassen für unbegrenzte Menge</i>
          </div>

          <TextInputComponent
            v-if="ConfigTypeMap.getType(key).type === 'string'"
            v-model="model[key]"
            class="w-full"
          />
          <select
            v-if="ConfigTypeMap.getType(key).type === 'enum'"
            v-model="model[key]"
            class="w-full"
          >
            <option
              v-for="option in ConfigTypeMap.getType(key).options"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </td>
      </tr>
    </table>
    <div class="flex items-center">
      <ButtonComponent @click="$emit('cancel')">Abbrechen</ButtonComponent>
      <div class="grow text-center text-red-500">{{ errorMessage }}</div>
      <ButtonComponent @click="save()">Speichern</ButtonComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConfigKey } from '../../../../model/configuration/ConfigKey';
import { IConfigEntry } from '../../../../model/configuration/IConfigEntry';
import { ConfigTypeMap } from '../../../../model/configuration/ConfigTypeMap';
import { PropType, ref } from 'vue';
import InteractableComponent from '../InteractableComponent.vue';
import ButtonComponent from '../ButtonComponent.vue';
import TextInputComponent from '../TextInputComponent.vue';

const props = defineProps({
  config: {
    type: Object as PropType<Record<ConfigKey, unknown>>,
    required: true,
  },
});

const emits = defineEmits(['save', 'cancel']);

const configKeys = [
  ConfigKey.MAX_SEQUENCES_PER_USER,
  ConfigKey.MAX_SLIDES_PER_SEQUENCE,
];

/**
 * Returns a record of the current config
 * @returns Record of the current config
 */
function getConfigRecord(): Record<ConfigKey, string> {
  const result: Partial<Record<ConfigKey, string>> = {};

  for (const entry of configKeys) {
    console.log(props.config[entry]);
    result[entry] = props.config[entry] as string;
  }
  return result as Record<ConfigKey, string>;
}

const model = ref(getConfigRecord());

const keyOrder: ConfigKey[] = [
  ConfigKey.MAX_SEQUENCES_PER_USER,
  ConfigKey.MAX_SLIDES_PER_SEQUENCE,
];

const keyDescribtion: Record<ConfigKey, string> = {
  [ConfigKey.MAX_SEQUENCES_PER_USER]: 'Maximale Sequenzen pro Nutzer',
  [ConfigKey.MAX_SLIDES_PER_SEQUENCE]: 'Maximale Folien pro Sequenz',
};

/**
 * Checks whether the given input for the key is valid
 * @param key Key to check for
 * @returns True if the input is valid, false otherwise
 */
function checkValidInput(key: ConfigKey): boolean {
  const type = ConfigTypeMap.getType(key);
  switch (type.type) {
    case 'number':
      if (!(model.value[key] + '').match(/[0-9]*/)) {
        return false;
      }
      return !(
        type.options &&
        type.options.length > 0 &&
        type.options[0] == 'limited' &&
        model.value[key] == ''
      );

    case 'string':
      return model.value[key] !== '';
    default:
      return true;
  }
}

const errorMessage = ref('');

/**
 * Saves the current configuration
 */
function save(): void {
  for (const key of keyOrder) {
    if (!checkValidInput(key)) {
      errorMessage.value = `Ungültige Eingabe für "${keyDescribtion[key]}"`;
      return;
    }
  }

  const result: IConfigEntry[] = [];
  for (const key of keyOrder) {
    result.push({
      key: key,
      value: model.value[key],
    });
  }

  errorMessage.value = '';
  emits('save', result);
}
</script>
