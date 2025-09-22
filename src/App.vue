<template>
  <Toaster />
  <AlertDialog />
  <router-view />
</template>

<script setup lang="ts">
import AlertDialog from "@/components/controls/AlertDialog.vue";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>
