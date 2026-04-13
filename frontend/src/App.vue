<script setup>
import LoadingOverlay from "./components/ui/LoadingOverlay.vue";
import ToastContainer from "./components/ui/ToastContainer.vue";
</script>

<template>
  <RouterView />
  <LoadingOverlay />
  <ToastContainer />
</template>
