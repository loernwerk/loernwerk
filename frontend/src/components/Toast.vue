<template>
<ContainerComponent class="bg-red-700">
    <div class="text-white text-center">
        {{ message }}
    </div>
</ContainerComponent>
</template>
<script setup lang="ts">
import ContainerComponent from './ContainerComponent.vue';



defineProps({
    message: {
        type: String,
        required: true,
    },
})

</script>
  