<template>
  <div>
    <maze />

    <section class="hero is-fullheight">
      <div class="hero-body container">
        <h1 class="title">
          <div class="brand">
            <div>⟁</div>
            <div>⟁</div>
            <div>⟁</div>
          </div>
          <div class="name">
            Planecha<span class="dot">.</span>se
          </div>
        </h1>
        <h2 class="subtitle">
          A Planechase companion app for people playing remotely (or locally)
        </h2>
        <div class="btn-grp">
          <router-link class="button is-primary" to="/create">
            Create game
          </router-link>
        </div>
      </div>

      <div class="hero-foot">
        <nav class="tabs is-right">
          <div class="container">
            <ul>
              <li><router-link to="/about">About</router-link></li>
            </ul>
          </div>
        </nav>
      </div>
    </section>

    <branded-footer>
      <p>
        Planecha.se is unofficial Fan Content permitted under the
        <l href="https://company.wizards.com/en/legal/fancontentpolicy">Fan Content Policy</l>.
        Not approved/endorsed by Wizards.<br>
        Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
      </p>
      <p>
        Card data are provided by <l href="https://scryfall.com">Scryfall</l>.
      </p>
      <p>
        Planecha.se uses icons provided by <l href="https://fontawesome.com">Font Awesome</l>
        according to the <l href="https://fontawesome.com/license">Font Awesome License</l>.
      </p>
      <p>
        Dices icons by Fritz Duggan from <l href="https://thenounproject.com/browse/collection-icon/dice-150631/">Noun Project</l>.
        <br/>
        Coin icon by Iain Hector from <l href="https://thenounproject.com/icon/coin-55698/">Noun Project</l>.
      </p>
      <p>
        The "maze" background font is from <l href="http://mazeletter.xyz/">Mazeletter</l>.
      </p>
      <p>
        Build version: <l :href="'https://github.com/de-luca/planecha.se/tree/' + sha"><code>{{ sha }}</code></l>
      </p>
    </branded-footer>
  </div>
</template>

<script lang="ts" setup>
import Maze from '@/components/Maze.vue';
import BrandedFooter from '@/components/BrandedFooter.vue';
const sha = import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
</script>

<style lang="scss" scoped>
.tabs a {
  color: var(--brand-color-secondary);
  &:hover {
    color: var(--brand-color-primary);
  }
}

.hero-body.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;

  .btn-grp {
    display: inline-flex;
    gap: 1rem;
    justify-content: center;

    .button {
      width: 150px;
    }
  }

  .name {
    color: var(--brand-color-primary);

    .dot {
      color: var(--brand-color-secondary);
    }
  }

  .brand {
    text-align: center;
    font-family: arial;
    color: var(--brand-color-primary);

    div {
      position: relative;
      z-index: 1;
      display: inline-block;
      font-size: 4rem;
      width: 5rem;
      line-height: 4rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: var(--brand-color-secondary);
      }

      &:nth-child(1) {
        transform: rotate(180deg) translateX(-2.5rem);
      }
      &:nth-child(2) {
        z-index: 2;
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(2.5rem);
      }
    }
  }

  .subtitle {
    color: var(--brand-color-secondary);
  }
}
</style>
