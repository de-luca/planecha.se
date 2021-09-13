<template>
  <div class="container">
    <h1 class="title">
        <router-link class="brand" to="/">
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
        It can be used in combination with
        <a href="https://www.spelltable.com" rel="noopener noreferrer" target="_blank">SpellTable</a>
        for fully remote game or locally when you don't have a deck or
        when you need that precious space on your table.
      </p>

      <h2>What does it do?</h2>
      <p>
        Two game modes are supported:
        <dl>
          <dt><b>Classic Planechase</b></dt>
          <dd>
            The "Single Planar Deck Option" described in
            <a href="https://magic.wizards.com/en/game-info/gameplay/rules-and-formats/rulesrule " rel="noopener noreferrer" target="_blank">rule</a>
            901.15.
          </dd>
          <dt><b>Eternities Map</b></dt>
          <dd>
            The Planechase variant described
            <a href="https://magic.wizards.com/en/articles/archive/feature/eternities-map-2010-07-19" rel="noopener noreferrer" target="_blank">here</a>
            or in the <a href="https://youtu.be/TGJaJ29Zs6o" rel="noopener noreferrer" target="_blank">Professor's video</a>.<br>
            Multiple variants and configurations are also availables such as Phenomena encountering and dedicated Phenomena deck.
          </dd>
        </dl>
      </p>
      <p>
        The app also offers two ways to play Planechase:
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
      </p>

      <h2>How does that work?</h2>
      <p>
        <em>Planecha.se</em> uses
        <a href="https://en.wikipedia.org/wiki/WebRTC" rel="noopener noreferrer" target="_blank">WebRTC</a>
        to transmit the game between players in the same game.<br>
        In order for users to connect with each other, a "signaling server" is used.
        This allows them to find the route to connect through the maze of the internet.
      </p>
      <p>
        The app does not require you to create an account, login or any personal informations from players
        and aim to be as privacy friendly as possible.<br>
        The only server connection is with the "signaling server" and can be audited
        <a href="https://github.com/de-luca/beacon" rel="noopener noreferrer" target="_blank">here</a>.
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
</template>

<script lang="ts">
import { Vue } from 'vue-class-component';
export default class About extends Vue {}
</script>

<style lang="scss" scoped>
.container {
  width: 800px;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.content {
  text-align: justify;
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
