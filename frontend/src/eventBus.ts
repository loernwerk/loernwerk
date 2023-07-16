import { ref } from 'vue';
const bus = ref(new Map());

export default function useEventsBus() {
  function emit(event: string, ...args: unknown[]) {
    bus.value.set(event, args);
  }

  return {
    emit,
    bus,
  };
}
