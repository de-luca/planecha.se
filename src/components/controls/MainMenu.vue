<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group flex items-center" as-child>
      <Button variant="ghost" class="hover:cursor-pointer h-9 w-9">
        <Cog class="group-hover:motion-safe:animate-spin size-7" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Theme: <ThemeSelector />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Username: <NameModal />
      </DropdownMenuLabel>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Cog } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import NameModal from "@/components/controls/NameModal.vue";
import ThemeSelector from "@/components/controls/ThemeSelector.vue";
</script>
