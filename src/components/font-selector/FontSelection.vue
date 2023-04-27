<template>
    <ul aria-role="menuitem" aria-hidden="true">
        <button @click=fontFamilyClicked>{{ friendlyName }}</button>
    </ul>
</template>
  
<script lang="ts" setup>
import {
    defineProps,
    defineEmits
} from 'vue';

const emit = defineEmits(['fontFamilyClicked']);

const props = defineProps({
    friendlyName: { type: String, default: '' },
    fontFamily: { type: String, default: '' }
})

function fontFamilyClicked() {
    emit('fontFamilyClicked', props.fontFamily);
}
</script>
  
<style scoped>
button {
    font-family: var(--app-font-family);
    font-size: 1.5rem;
    
}
</style>
