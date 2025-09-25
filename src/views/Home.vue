<template>
  <div class="container">
    <Maze />

    <section class="relative h-screen w-full flex flex-col items-center justify-center">
      <div class="flex-1 flex flex-col items-center justify-center">
        <h1 class="text-center">
          <div class="font-[Arial] text-[4rem]">
            <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[5rem] z-1 rotate-180 translate-x-[2.5rem]">⟁</div>
            <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[5rem] z-2">⟁</div>
            <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[5rem] z-1 rotate-180 translate-x-[-2.5rem]">⟁</div>
          </div>
          <div class="text-4xl font-weight-600 tracking-tight">
            Planecha<span class="text-muted-foreground">.</span>se
          </div>
        </h1>
        <h2 class="text-xl text-muted-foreground">
          A Planechase companion app for people playing remotely (or locally)
        </h2>

        <Button class="mt-[1rem] w-[150px]" as-child>
          <router-link to="/create">Create Game</router-link>
        </Button>

        <div class="mt-6 flex flex-col items-center">
          <div class="pb-1">
            <Badge variant="secondary">NEW</Badge>
            MagicCon Unknown Event Planes
          </div>
          <div>
            <Badge>NEW</Badge>
            Redesigned all the things
          </div>
        </div>
      </div>

      <nav class="justify-self-end w-full flex justify-end">
        <Button variant="link">
          <l href="https://dungeon.planecha.se">Dungeon</l>
        </Button>
        <Button variant="link" class="underline underline-offset-4">
          <router-link to="/about">About</router-link>
        </Button>
      </nav>
    </section>

    <BrandedFooter>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Planecha.se is unofficial Fan Content permitted under the
        <l class="font-medium text-primary" href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</l>.
        Not approved/endorsed by Wizards.<br>
        Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Card data is provided by <l class="font-medium text-primary" href="https://scryfall.com">Scryfall</l>.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Dices icons by Fritz Duggan from <l class="font-medium text-primary" href="https://thenounproject.com/browse/collection-icon/dice-150631/">Noun Project</l>.
        <br/>
        Coin icon by Iain Hector from <l class="font-medium text-primary" href="https://thenounproject.com/icon/coin-55698/">Noun Project</l>.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        The "maze" background font is from <l class="font-medium text-primary" href="http://mazeletter.xyz/">Mazeletter</l>.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Build version: 
        <l :href="'https://github.com/de-luca/planecha.se/tree/' + sha">
          <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold" >{{ sha }}</code>
        </l>
      </p>
    </BrandedFooter>
  </div>
</template>

<script lang="ts" setup>
import { BrandedFooter, Maze } from "@/components/controls";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const sha = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
</script>
