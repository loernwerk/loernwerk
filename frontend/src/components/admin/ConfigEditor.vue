<template>
  <div class="flex flex-col">
    <table class="h-fit">
      <tr v-for="key in configKeys" :key="key">
        <td class="p-2">{{ keyDescription[key] }}:</td>

        <td class="p-2">
          <div
            v-if="ConfigTypeMap.getType(key).type === 'number'"
            class="flex space-x-2 items-center"
          >
            <TextInputComponent v-model="model[key]" />
            <i>{{ $t('config.emptyPossible') }}</i>
          </div>

          <TextInputComponent
            v-if="ConfigTypeMap.getType(key).type === 'string'"
            v-model="model[key]"
            class="w-full"
          />
          <input
            v-if="ConfigTypeMap.getType(key).type === 'boolean'"
            type="checkbox"
            v-model="model[key]"
          />
          <select
            v-if="ConfigTypeMap.getType(key).type === 'enum'"
            v-model="model[key]"
            class="w-full bg-transparent"
          >
            <option
              v-for="option in getEnumOptions(key)"
              :key="option"
              :value="option"
              class="bg-interactable"
            >
              {{ $t('config.' + option) }}
            </option>
          </select>
        </td>
      </tr>
    </table>
    <div class="flex items-center">
      <div class="grow text-center text-red-500">
        <div v-if="errorKey">
          {{ $t('config.invalidInput', { object: keyDescription[errorKey] }) }}
        </div>
      </div>
      <ButtonComponent :loading="disableButton" @click="save()">{{
        $t('save')
      }}</ButtonComponent>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ConfigKey } from '../../../../model/configuration/ConfigKey';
import { IConfigEntry } from '../../../../model/configuration/IConfigEntry';
import { ConfigTypeMap } from '../../../../model/configuration/ConfigTypeMap';
import { PropType, Ref, ref } from 'vue';
import ButtonComponent from '../ButtonComponent.vue';
import TextInputComponent from '../TextInputComponent.vue';
import { i18n } from '../../i18n';
import { ConfigRestInterface } from '../../restInterfaces/ConfigRestInterface';

const props = defineProps({
  /**
   * The entries to edit
   */
  entries: {
    type: Object as PropType<Record<ConfigKey, unknown>>,
    required: true,
  },
});

const emits = defineEmits([
  /**
   * Emmited when saving was succesfull
   */
  'save',
]);

const configKeys = [
  ConfigKey.MAX_SEQUENCES_PER_USER,
  ConfigKey.MAX_SLIDES_PER_SEQUENCE,
  ConfigKey.REGISTRATION_TYPE,
  ConfigKey.REGISTRATION_CODES,
  ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE,
];

const disableButton = ref(false);

/**
 * Returns a record of the current config
 * @returns Record of the current config
 */
function getConfigRecord(): Record<ConfigKey, string> {
  const result: Partial<Record<ConfigKey, string>> = {};

  for (const entry of configKeys) {
    const type = ConfigTypeMap.getType(entry);
    if (type.type === 'number') {
      if (props.entries[entry] == -1) {
        result[entry] = '';
      } else {
        result[entry] = props.entries[entry] + '';
      }
    } else {
      result[entry] = props.entries[entry] as string;
    }
  }
  return result as Record<ConfigKey, string>;
}

const model = ref(getConfigRecord());

const keyDescription: Record<ConfigKey, string> = {
  [ConfigKey.MAX_SEQUENCES_PER_USER]: i18n.global.t('config.maxSequences'),
  [ConfigKey.MAX_SLIDES_PER_SEQUENCE]: i18n.global.t('config.maxSlides'),
  [ConfigKey.REGISTRATION_TYPE]: i18n.global.t('config.registrationType'),
  [ConfigKey.REGISTRATION_CODES]: i18n.global.t('config.registrationCodes'),
  [ConfigKey.REGISTRATION_CODES_EXPIRES_AFTER_USE]: i18n.global.t(
    'config.registrationCodesExpirations'
  ),
};

/**
 * Returns valid options for this config enum.
 * @param key ConfigKey to get options for
 * @returns Array of all valid options
 */
function getEnumOptions(key: ConfigKey): string[] {
  const configType = ConfigTypeMap.getType(key);
  if (configType.type !== 'enum') {
    return [];
  }
  return configType.options;
}

/**
 * Checks whether the given input for the key is valid
 * @param key Key to check for
 * @returns True if the input is valid, false otherwise
 */
function checkValidInput(key: ConfigKey): boolean {
  const type = ConfigTypeMap.getType(key);
  switch (type.type) {
    case 'number':
      if (!(model.value[key] + '').match(/^[0-9]*$/)) {
        return false;
      }
      return !(type.options === 'limited' && model.value[key] === '');
    case 'string':
      return model.value[key] !== '';
    default:
      return true;
  }
}

const errorKey: Ref<ConfigKey | undefined> = ref(undefined);

/**
 * Gets the save value for the given key
 * @param key Key to get the save value for
 * @returns Save value for the given key
 */
function getSaveValue(key: ConfigKey): unknown {
  const type = ConfigTypeMap.getType(key);
  switch (type.type) {
    case 'number':
      if (model.value[key] == '') {
        return -1;
      }
      return parseInt(model.value[key]);
    case 'boolean':
      return model.value[key] as unknown as boolean;
    default:
      return model.value[key] + '';
  }
}

/**
 * Saves the current configuration
 */
async function save(): Promise<void> {
  disableButton.value = true;
  for (const key of configKeys) {
    if (!checkValidInput(key)) {
      errorKey.value = key;
      return;
    }
  }

  const result: IConfigEntry[] = [];
  for (const key of configKeys) {
    result.push({
      key: key,
      value: getSaveValue(key),
    });
  }

  errorKey.value = undefined;

  for (const entry of result) {
    await ConfigRestInterface.setValue(entry.key, entry.value);
  }

  emits('save');
}
</script>
