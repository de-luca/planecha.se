<template>
  <footer class="footer">
    <div class="container content">
      <slot></slot>
      <div class="bottom">
        <div class="brand">
          <div class="logo">
            <div>⟁</div>
            <div>⟁</div>
            <div>⟁</div>
          </div>
          <div class="name">
            Planecha<span class="dot">.</span>se
          </div>
        </div>
        <a href="https://github.com/de-luca/planecha.se" rel="noopener noreferrer" target="_blank">
          <fa :icon="['fab', 'github']" fixed-width size="lg"/>
        </a>
        <div class="theme-container">
          <theme-selector />
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import ThemeSelector from '@/components/ThemeSelector.vue';

@Options({ components: { ThemeSelector } })
export default class BrandedFooter extends Vue {}
</script>

<style lang="scss" scoped>
.footer {
  padding-top: 3rem;
  padding-bottom: 3rem;

  background-color: var(--bg-color);
  border-top: 1px solid var(--brand-maze-color);

  .container {
    max-width: 64rem;
  }

  .bottom {
    &:not(:first-child) {
      margin-top: 3rem;
    }

    display: flex;
    justify-content: space-between;
    align-items: center;


    a {
      color: var(--brand-color-secondary);

      &:hover {
        color: var(--brand-color-primary);
      }
    }

    .brand {
      display: flex;

      .logo {
        font-family: arial;
        color: var(--brand-color-primary);

        div {
          position: relative;
          z-index: 1;
          display: inline-block;
          font-size: 1.5rem;
          line-height: 1.5rem;
          width: 2.5rem;
          text-align: center;

          &:hover {
            cursor: pointer;
            color: var(--brand-color-secondary);
          }

          &:nth-child(1) {
            transform: rotate(180deg)
          }
          &:nth-child(2) {
            transform: translateX(-1.5rem);
            z-index: 2;
          }
          &:nth-child(3) {
            transform: rotate(180deg) translateX(3rem);
            position: absolute;
          }
        }
      }

      .name {
        color: var(--brand-color-primary);

        .dot {
          color: var(--brand-color-secondary);
        }
      }
    }
  }
}
</style>
