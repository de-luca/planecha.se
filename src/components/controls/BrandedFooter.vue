<template>
  <footer class="py-8">
      <slot></slot>
      <div class="mt-8 flex justify-between items-center">
        <div class="grow flex items-center">
          <div class="font-[Arial] text-[1.5rem]">
            <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block z-1 w-[2.5rem] text-center rotate-180">⟁</div>
            <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block z-2 w-[2.5rem] text-center translate-x-[-1.5rem]">⟁</div>
            <div class="hover:text-muted-foreground hover:cursor-pointer absolute inline-block z-1 w-[2.5rem] text-center rotate-180 translate-x-[-3rem]">⟁</div>
          </div>
          <div class="name">
            Planecha<span class="text-muted-foreground">.</span>se
          </div>
        </div>
        <MainMenu />
      </div>
  </footer>
</template>

<script setup lang="ts">
import MainMenu from "./MainMenu.vue";
</script>
