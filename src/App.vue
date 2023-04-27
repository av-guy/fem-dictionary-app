<template>
    <header>
      <FontSelector></FontSelector>
    </header>
</template>

<script lang="ts" setup>
import FontSelector from './components/font-selector/FontSelector.vue';
</script>

<style>
/* -------- Themes Start -------- */

[data-font-theme="ff-sans-serif"] {
  --app-font-family: sans-serif;
  --app-root-font-size: 16px;
}

[data-font-theme="ff-serif"] {
  --app-font-family: serif;
  --app-root-font-size: 16px;
}

[data-font-theme="ff-monospace"] {
  --app-font-family: monospace;
  --app-root-font-size: 16px;
}

[data-theme="dark"] {
  --app-bg-color: hsl(0, 0%, 0%);
  --app-text-color: hsl(0, 0%, 100%);
}

[data-theme="light"] {
  --app-bg-color: hsl(0, 0%, 100%);
  --app-text-color: hsl(0, 0%, 0%);
}

/* -------- Themes End -------- */

body {
  font-size: var(--app-root-font-size);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: var(--app-font-family);
}
</style>
