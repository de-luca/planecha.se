<template>
  <Toaster />
  <AlertDialog />
  <PlayerNameDialog />
  <router-view />
</template>

<script setup lang="ts">
import { AlertDialog, PlayerNameDialog } from "@/components/controls";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>
