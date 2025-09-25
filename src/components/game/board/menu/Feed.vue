<template>
  <Sheet :modal="false">
    <SheetTrigger class="absolute bottom-[1rem] right-[1rem]">
      <Button variant="outline" size="icon" title="Show logs">
        <Logs />
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader class="h-full">
        <SheetTitle class="text-xl">⟁</SheetTitle>
        <SheetDescription class="h-full text-foreground overflow-x-auto">
          <p v-for="m in store.feed" :key="m" v-html="m"></p>
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Logs } from "lucide-vue-next";

import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

import { useMain } from "@/store/main";

const store = useMain();
</script>
