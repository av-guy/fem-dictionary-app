<template>
    <menu
        :class="{expanded: menuExpanded}"
        aria-role="menu" :aria-expanded=menuExpanded>
        <FontSelection
            v-for="item in availableFonts"
            :key="item.name"
            :friendlyName="item.name"
            :fontFamily="item.value"
            @fontFamilyClicked=handleSelection
        ></FontSelection>
    </menu>
</template>
  
<script lang="ts" setup>
import FontSelection from './FontSelection.vue';
import { reactive, ref } from 'vue';

const menuExpanded = ref(false);

const availableFonts = reactive([
    reactive({ name: 'Serif', value: 'serif' }),
    reactive({ name: 'Sans Serif', value:'sans-serif' }),
    reactive({ name: 'Monospace', value:'monospace' })
])

function handleSelection(fontFamily: string) {
    console.log(fontFamily);
    if (!menuExpanded.value)
        menuExpanded.value = true;
}
</script>
  
<style scoped>
menu > ul {
    display: none;
}

menu > ul:nth-child(1) {
    display: inline-block;
}

.expanded > ul, .expanded > ul:nth-child(1) {
    display: block;
}
</style>
