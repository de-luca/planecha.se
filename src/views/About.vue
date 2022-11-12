<template>
  <div class="wrapper">
    <h1 class="title">
      <router-link class="brand" title="Back Home" to="/">
        <div>⟁</div>
        <div>⟁</div>
        <div>⟁</div>
      </router-link>
    </h1>

    <div class="content">
      <h2>What's that?</h2>
      <p>
        <em>Planecha.se</em> is a companion app that allows people to play Magic: The Gathering Planechase variant
        remotely without the need to currate a Planar deck or a dedicated setup for it.
      </p>
      <p>
        It can be used in combination with <l href="https://www.spelltable.com">SpellTable</l>
        for fully remote game or locally when you don't have a deck or when you need that precious space on your table.
      </p>
      <p>
        <em>Planecha.se</em> is open source and its code can be found <l href="https://github.com/de-luca/planecha.se">here</l>.
      </p>

      <h2>What does it do?</h2>
      <p>
        Two game modes are supported:
      </p>
      <dl>
        <dt><b>Classic Planechase</b></dt>
        <dd>
          The "Single Planar Deck Option" described in
          <l href="https://magic.wizards.com/en/game-info/gameplay/rules-and-formats/rules">rule</l> 901.15.
        </dd>
        <dt><b>Eternities Map</b></dt>
        <dd>
          The Planechase variant described <l href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19">here</l>
          or in the <l href="https://youtu.be/TGJaJ29Zs6o">Professor's video</l>.<br>
          Multiple variants and configurations are also availables such as Phenomena encountering and dedicated Phenomena deck.
        </dd>
      </dl>
      <p>
        The app also offers two ways to play Planechase:
      </p>
      <dl>
        <dt><b>Locally</b></dt>
        <dd>
          Use this app from your computer as a Planechase deck for your MtG game.
        </dd>
        <dt><b>Remotely</b></dt>
        <dd>
          Use this app to create a game which you can then share the link with other players and
          have a synchronized Planar deck that you can use during your remote MtG game.
        </dd>
      </dl>

      <h2>How does that work?</h2>
      <p>
        <em>Planecha.se</em> uses <l href="https://github.com/dmotz/trystero">Trystero</l>
        to connect and transmit data between player within a game.
      </p>
      <p>
        The app does not require you to create an account, login or any personal informations from players
        and aim to be as privacy friendly as possible.
      </p>

      <h2>But why?</h2>
      <p>
        Because I could?<br>
        I did not find a similar tool that would support synchronized remote play so I took
        on myself to make it.<br>
        If it actualy existed... Then it was a reason to learn and pass time.
      </p>
      <p>
        This is a labor of love.<br>
        I am a full time backend engineer, have no interest in front end, so this project
        was really hard and took me out of my confort zone.<br>
        My goal was to make something as offline as possible (ironic on the internet)
        and give the maximum to users while preserving their privacy as much
        as possible.<br>
        I don't think I ever learned as much in so little time outside of that project.
      </p>

      <h2>What's with the logo?</h2>
      <p>
        It's the unicode caracter <code>x27c1</code> with some CSS to make it look <em>"cool"</em>.
      </p>
    </div>
  </div>

  <branded-footer />
</template>

<script lang="ts" setup>
import BrandedFooter from '@/components/BrandedFooter.vue';
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 1rem;
  padding-bottom: 3rem;
  margin: 0 auto;
  position: relative;
  width: auto;
  max-width: 800px;
  min-height: 100vh;
}

.content {
  text-align: justify;

  h2 {
    color: var(--primary);
  }
}

.title {
  text-align: center;

  .brand {
    font-family: arial;
    color: var(--brand-color-primary);

    div {
      position: relative;
      z-index: 1;
      display: inline-block;
      font-size: 6rem;
      width: 7rem;
      line-height: 6rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: var(--brand-color-secondary);
      }

      &:nth-child(1) {
        transform: rotate(180deg) translateX(-3.5rem);
      }
      &:nth-child(2) {
        z-index: 2;
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(3.5rem);
      }
    }
  }
}
</style>
