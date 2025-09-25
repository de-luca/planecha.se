<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group flex items-center" as-child>
      <Button variant="ghost" class="h-9 w-9">
        <Cog class="group-hover:motion-safe:animate-spin size-7" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Theme: <ThemeSelector />
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuLabel class="flex gap-10 justify-between items-center">
        Username: 
        <Button 
          @click="nameState.open = true"
          class="w-50" 
          variant="secondary"
        >
          {{ store.username ?? 'Not set' }}
        </Button>
      </DropdownMenuLabel>
    </DropdownMenuContent>
  </DropdownMenu>
</template>

<script setup lang="ts">
import { Cog } from "lucide-vue-next";
import { ThemeSelector } from "@/components/controls";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMain, useUI } from "@/store";

const store = useMain();
const nameState = useUI().name;
</script>
