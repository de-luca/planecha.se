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
  <!-- <div class="wrapper" :class="{ open: open }">
    <div
      class="toggle"
      title="Toggle game logs"
      @click="open = !open"
    >
      <fa :icon="open ? 'chevron-right' : 'chevron-left'" />
    </div>

    <div class="logs box">
      <p>⟁</p>
      <p v-for="m in messages" :key="m" v-html="m"></p>
    </div>
  </div> -->
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

<!-- <script lang="ts">
import { Component, Vue } from "vue-facing-decorator";
import { useMain } from "@/store/main";

@Component
export default class Feed extends Vue {
	private store = useMain();
	public open = false;

	public get messages(): Array<string> {
		return this.store.feed;
	}
}
</script> -->

<!-- <style lang="scss" scoped>
@keyframes open {
  0% { transform: translateX(0) }
  100% { transform: translateX(-20rem) }
}
@keyframes close {
  0% { transform: translateX(-20rem) }
  100% { transform: translateX(0) }
}

.wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  z-index: 50;

  &.open {
    .toggle, .logs {
      animation: open .10s ease-in forwards;
    }
  }
}

.toggle {
  cursor: pointer;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  right: 0;
  animation: close .10s ease-in forwards;
  border-left: 1px solid var(--border-color);
  writing-mode: vertical-lr;
  text-align: center;
  background-color: var(--bg-color);
  color: var(--brand-color-secondary);

  &:hover {
    color: var(--brand-color-primary);
  }
}


.logs {
  position: absolute;
  top: 0;
  right: -20rem;
  height: 100%;
  width: 20rem;
  z-index: 1;
  padding: 0;
  margin: 0;
  border-radius: 0;
  border-left: 1px solid var(--border-color);
  overflow-x: scroll;

  color: var(--text-color);
  background-color: var(--bg-color);

  animation: close .10s ease-in forwards;

  display: flex;
  flex: 1;
  flex-direction: column;

  p {
    padding: .3rem .75rem;
    &:not(:last-child) {
      &:first-child {
        border-bottom: none;
        color: var(--brand-color-secondary);
      }
      border-bottom: 1px solid var(--border-color);
    }
  }
}
</style> -->
