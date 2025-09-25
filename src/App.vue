<template>
  <Toaster />
  <AlertDialog />
  <NameDialog />
  <router-view />
</template>

<script setup lang="ts">
import { AlertDialog, NameDialog } from "@/components/controls";
import { Toaster } from "@/components/ui/sonner";
import "vue-sonner/style.css";
</script>
