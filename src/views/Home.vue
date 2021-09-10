<template>
  <div>
    <maze />

    <section class="hero is-fullheight">
      <div class="hero-body container">
        <div class="cta">
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
          <div class="btn-grp">
            <router-link class="button is-light" to="/join">
              Join game
            </router-link>
            <router-link class="button is-dark" to="/create">
              Create game
            </router-link>
          </div>
        </div>
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
.hero-body.container {
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;

  .cta {
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .btn-grp {
      display: inline-flex;
      gap: 1rem;

      .button {
        width: 150px;
      }
    }

    .name .dot {
      color: gray;
    }

    .brand {
      text-align: center;
      font-family: arial;

      div {
        position: relative;
        z-index: 1;
        display: inline-block;
        font-size: 2.5rem;
        width: 3rem;
        line-height: 3rem;
        text-align: center;

        &:hover {
          cursor: pointer;
          color: gray;
        }

        &:nth-child(1) {
          transform: rotate(180deg) translateX(-1.5rem);
        }
        &:nth-child(2) {
          z-index: 2;
        }
        &:nth-child(3) {
          transform: rotate(180deg) translateX(1.5rem);
        }
      }
    }
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
