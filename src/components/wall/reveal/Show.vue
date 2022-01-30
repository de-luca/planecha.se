<template>
  <div class="modal" style="display: block">
    <div class="modal-background"></div>
    <div class="modal-content">

      <div class="header">
        <p class="source"><em><b>{{ config.mateName }}</b> encountered</em></p>
        <h1 class="title" v-if="config.title" v-html="config.title"></h1>
        <h2 class="subtitle" v-if="config.subTitle" v-html="config.subTitle"></h2>
      </div>

      <div class="tabs is-centered is-medium">
        <ul>
          <li :class="{ 'is-active': activeTab === 'relevant' }">
            <a @click="activeTab = 'relevant'">Relevant Cards ({{ revealed.relevant.length }})</a>
          </li>
          <li :class="{ 'is-active': activeTab === 'others' }">
            <a @click="activeTab = 'others'">Others ({{ revealed.others.length }})</a>
          </li>
        </ul>
      </div>

      <div class="revealed">
        <div class="relevant" v-if="activeTab === 'relevant'">
          <template v-for="(c, index) in revealed.relevant" :key="c.id">
            <div
              class="card-wrapper"
              :style="cardTransform(index, revealed.relevant.length)"
            >
              <img :src="buildImgSrc(c)">
            </div>
          </template>
        </div>

        <div class="others" v-if="activeTab === 'others' && revealed.others.length > 0">
          <template v-for="(c, index) in revealed.others" :key="c.id">
            <div
              class="card-wrapper"
              :style="cardTransform(index, revealed.others.length)"
            >
              <img :src="buildImgSrc(c)">
            </div>
          </template>
        </div>
        <div class="others" v-if="activeTab === 'others' && revealed.others.length === 0">
          <em>Such Empty!</em>
        </div>
      </div>

      <div class="confirm">
        <button class="button is-secondary is-medium" @click="confirm">
          Okay
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { mixins, Options } from 'vue-class-component';
import { Imgable } from '@/components/Imgable';
import { BaseReveal } from './BaseReveal';

@Options({
  emits: ['done'],
})
export default class Show extends mixins(Imgable).with(BaseReveal) {
  private static readonly fanAngle = 5;

  private activeTab: string = 'relevant';
  private isVertical: Boolean = false;

  private mediaQuery: MediaQueryList;

  public created(): void {
    this.mediaQuery = window.matchMedia(
      'screen and (max-width: 800px) and (orientation: portrait)'
    );
    this.isVertical = this.mediaQuery.matches;
    this.mediaQuery.addEventListener('change', this.computeVerticality);
  }

  public unmounted(): void {
    this.mediaQuery.removeEventListener('change', this.computeVerticality);
  }

  private computeVerticality(ev: MediaQueryListEvent): void {
    this.isVertical = ev.matches;
  }

  public cardTransform(i: number, total: number): Record<string, string> {
    if (this.isVertical) {
      return this.cardStack(i);
    }

    return this.cardAngle(i, total);
  }

  private cardStack(i: number): Record<string, string> {
    if (i === 0) {
      return {};
    }

    return {
      position: 'absolute',
      top: `${i * 2}rem`,
    };
  }

  private cardAngle(i: number, total: number): Record<string, string> {
    const angle = (Show.fanAngle * i) - ((Show.fanAngle * (total - 1)) / 2);

    return { transform: `rotate(${angle.toFixed(2)}deg)` };
  }

  public confirm(): void {
    const picked = this.config.sendShownTo === 'top' ? this.revealed.relevant : [];
    const left = this.revealed.others.concat(
      this.config.sendShownTo === 'top'
        ? []
        : this.revealed.relevant,
    );

    this.$emit('done', { picked, left });
  }
}
</script>

<style lang="scss" scoped>
@mixin small-header {
  .source {
    margin-bottom: -.5rem;
  }
  .title {
    margin-bottom: 0;
  }
  .subtitle {
    margin-top: -1rem;
  }
}

@keyframes move-up {
  0% { transform: translateY(0) }
  100% { transform: translateY(-2rem) }
}

@keyframes move-down {
  0% { transform: translateY(-2rem) }
  100% { transform: translateY(0) }
}

.modal-content {
  position: absolute;
  top: 0;
  left: 0;
  max-height: 100vh;
  height: 100%;
  width: 100%;
  margin: 0;

  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 3.5rem 2fr 1fr;
  column-gap: 1rem;
  row-gap: 1rem;
  grid-template-areas:
    "header"
    "tabs"
    "revealed"
    "confirm"
  ;

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: .5rem;
  }

  .header {
    @media screen and (max-width: 800px) and (orientation: portrait) {
      @include small-header;
    }
    @media screen and (max-height: 450px) and (orientation: landscape) {
      @include small-header;
    }

    grid-area: header;
    justify-content: flex-end;
    text-align: center;

    .source {
      opacity: .5;
    }
  }

  .tabs {
    grid-area: tabs;
    margin-bottom: 0;

    ul {
      border: none;
    }
  }

  .revealed {
    grid-area: revealed;
    gap: 5rem;
    position: relative;

    .relevant, .others {
      @media screen and (max-width: 800px) and (orientation: portrait) {
        flex-direction: column;
        justify-content: flex-start;
      }

      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      gap: .5rem;

      height: 100%;

      .card-wrapper {
        @media screen and (max-width: 800px) and (orientation: portrait) {
          position: unset;
          transform-origin: unset;
        }

        position: absolute;
        transform-origin: center calc(1vw * 150);

        max-height: 50vh;
        max-width: calc(100vw - 1rem);

        &:hover, &:active {
          z-index: 2;
        }

        img {
          @media screen and (max-width: 800px) and (orientation: portrait) {
            max-width: 100%;
          }

          height: 100%;
          max-height: 40vh;
          max-width: 30vw;
          border-radius: var(--card-radius);

          animation: move-down 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;

          &:hover {
            animation: move-up 0.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
          }
        }
      }
    }

    .others img {
      filter: grayscale(1);
    }
  }

  .confirm {
    grid-area: confirm;
    justify-content: center;

    button {
      width: var(--form-btn-width);
    }
  }
}
</style>
