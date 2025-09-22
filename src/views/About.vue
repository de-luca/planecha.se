<template>
  <div class="flex flex-col">
    <div class="relative flex flex-col justify-center items-center h-[15rem]">
      <Maze mode="parent" :dim="{ h: { v: 15, u: 'rem' } }" />
      <router-link title="Back Home" to="/" class="max-w-fit font-[Arial] text-[6rem] text-center">
        <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[7rem] z-1 rotate-180 translate-x-[3.5rem]">⟁</div>
        <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[7rem] z-2">⟁</div>
        <div class="hover:text-muted-foreground hover:cursor-pointer relative inline-block w-[7rem] z-1 rotate-180 translate-x-[-3.5rem]">⟁</div>
      </router-link>
    </div>

    <div class="container mt-10 text-justify">
      <h2
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        What's that?
      </h2>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        <em>Planecha.se</em> is a companion app that allows people to play Magic: The Gathering Planechase variant
        remotely without the need to currate a Planar deck or a dedicated setup for it.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        It can be used in combination with <l class="font-medium text-primary underline underline-offset-4" href="https://www.spelltable.com">SpellTable</l>
        for fully remote game or locally when you don't have a deck or when you need that precious space on your table.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        <em>Planecha.se</em> is open source and its code can be found <l class="font-medium text-primary underline underline-offset-4" href="https://github.com/de-luca/planecha.se">here</l>.
      </p>

      <h2
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        What does it do?
      </h2>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Three game modes are supported:
        <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <b>Single Deck Planechase</b>
            <p>
              The "Single Planar Deck Option" described in
              <l class="font-medium text-primary underline underline-offset-4" href="https://magic.wizards.com/en/game-info/gameplay/rules-and-formats/rules">rule</l> 901.15.
            </p>
          </li>
          <li>
            <b>Multi Deck Planechase</b>
            <p>
              The classic Planechase in which each player brings a 10 cards planar deck.
            </p>
          </li>
          <li>
            <b>Eternities Map</b>
            <p>
              The Planechase variant described <l class="font-medium text-primary underline underline-offset-4" href="https://web.archive.org/web/20221005215028/https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">here (archived article)</l>
              or in the <l class="font-medium text-primary underline underline-offset-4" href="https://youtu.be/TGJaJ29Zs6o">Professor's video</l>.<br>
              Multiple variants and configurations are also availables such as Phenomena encountering and dedicated Phenomena deck.
            </p>
          </li>
        </ul>
      </p>
        
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        The app also offers two ways to play Planechase:
        <ul class="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>
            <b>Locally</b>
            <p>
              Use this app from your computer as a Planechase deck for your MtG game.
            </p>
          </li>
          <li>
            <b>Remotely</b>
            <p>
              Use this app to create a game which you can then share the link with other players and
              have a synchronized Planar deck that you can use during your remote MtG game.
            </p>
          </li>
          <li>
            <b>Eternities Map</b>
            <p>
              The Planechase variant described <l class="font-medium text-primary underline underline-offset-4" href="https://web.archive.org/web/20221005215028/https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">here (archived article)</l>
              or in the <l class="font-medium text-primary underline underline-offset-4" href="https://youtu.be/TGJaJ29Zs6o">Professor's video</l>.<br>
              Multiple variants and configurations are also availables such as Phenomena encountering and dedicated Phenomena deck.
            </p>
          </li>
        </ul>
      </p>

      <h2
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        How does that work?
      </h2>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        <em>Planecha.se</em> uses a signaling server to allow players to connect to each other.<br>
        The server's sources can be found <l class="font-medium text-primary underline underline-offset-4" href="https://github.com/de-luca/beacon">here</l>.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        The app does not require you to create an account, login or any personal informations from players
        and aim to be as privacy friendly as possible.
      </p>

      <h2
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        But why?
      </h2>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        Because I could?<br>
        I did not find a similar tool that would support synchronized remote play so I took
        on myself to make it.<br>
        If it actualy existed... Then it was a reason to learn and pass time.
      </p>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        This is a labor of love.<br>
        I am a full time backend engineer, have no interest in front end, so this project
        was really hard and took me out of my confort zone.<br>
        My goal was to make something as offline as possible (ironic on the internet)
        and give the maximum to users while preserving their privacy as much
        as possible.<br>
        I don't think I ever learned as much in so little time outside of that project.
      </p>

      <h2
        class="mt-10 scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0"
      >
        What's with the logo?
      </h2>
      <p class="leading-7 [&:not(:first-child)]:mt-5">
        It's the unicode caracter <code class="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">x27c1</code> with some CSS to make it look <em>"cool"</em>.
      </p>
    </div>

    <BrandedFooter class="container"/>
  </div>
</template>

<script setup lang="ts">
import BrandedFooter from "@/components/controls/BrandedFooter.vue";
import Maze from "@/components/controls/Maze.vue";
</script>
