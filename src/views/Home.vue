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
          <router-link class="button is-light" to="/join">
            Join game
          </router-link>
          <router-link class="button is-dark" to="/create">
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

    <footer class="footer">
      <div class="container content">
        <p>
          Planecha.se is unofficial Fan Content permitted under the
          <a
            href="https://company.wizards.com/en/legal/fancontentpolicy"
            rel="noopener noreferrer"
            target="_blank"
          >Fan Content Policy</a>. Not approved/endorsed by Wizards.<br>
          Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
        </p>
        <p>
          Card data are provided by
          <a
            href="https://scryfall.com"
            rel="noopener noreferrer"
            target="_blank"
          >Scryfall</a>.
        </p>
        <p>
          Planecha.se uses icons provided by
          <a
            href="https://fontawesome.com"
            rel="noopener noreferrer"
            target="_blank"
          >Font Awesome</a>
          according to the
          <a
            href="https://fontawesome.com/license"
            rel="noopener noreferrer"
            target="_blank"
          >Font Awesome License</a>.
        </p>
        <p>
          The "maze" background font is from
          <a
            href="http://mazeletter.xyz/"
            rel="noopener noreferrer"
            target="_blank"
          >Mazeletter</a>.
        </p>
        <p>
          Build version: {{ sha }}
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Maze from '@/components/Maze.vue';

@Options({ components: { Maze } })
export default class Home extends Vue {
  public get sha(): string {
    return import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA;
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  .is-ghost {
    color: var(--brand-color-secondary);
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
      font-size: 5rem;
      width: 6rem;
      line-height: 5rem;
      text-align: center;

      &:hover {
        cursor: pointer;
        color: var(--brand-color-secondary);
      }

      &:nth-child(1) {
        transform: rotate(180deg) translateX(-3rem);
      }
      &:nth-child(2) {
        z-index: 2;
      }
      &:nth-child(3) {
        transform: rotate(180deg) translateX(3rem);
      }
    }
  }

  .subtitle {
    color: var(--brand-color-secondary);
  }
}

.footer {
  padding-top: 3rem;
  padding-bottom: 3rem;

  .container {
    max-width: 64rem;
  }
}
</style>
