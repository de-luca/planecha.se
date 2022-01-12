<template>
  <div class="notification pwa-notif" v-if="offlineReady || needRefresh">
    <template v-if="needRefresh">
      <p>
        A new version of Planecha.se is available.<br>
        Please reload to apply it.
      </p>
      <button
        class="button is-primary is-small"
        :class="{ 'is-loading': reloading }"
        :disabled="reloading"
        @click="reload()"
      >
        Reload now
      </button>
    </template>
    <template v-else>
      <span>Planecha.se is ready to work offline.</span>
      <button
        class="button is-primary is-small"
        @click="close()"
      >
        Dismiss
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { Component, Vue } from 'vue-facing-decorator';
import { useRegisterSW } from 'virtual:pwa-register/vue';

type UpdateSWFunction = ReturnType<typeof useRegisterSW>['updateServiceWorker'];

@Component
export default class ReloadPrompt extends Vue {
  private static readonly updateInterval = 10000;

  public reloading = false;

  // Just use any...
  // I can't get ref to actualy work or just have
  // isRef return true when using class attributes
  public offlineReady = ref(false);
  public needRefresh = ref(false);

  private updateServiceWorker: UpdateSWFunction;

  public created(): void {
    const sw = useRegisterSW({
      onRegistered: (r) => {
        r && setInterval(async() => {
          try { await r.update(); } catch(_) {}
        }, ReloadPrompt.updateInterval);
      },
    });

    this.offlineReady = sw.offlineReady;
    this.needRefresh = sw.needRefresh;
    this.updateServiceWorker = sw.updateServiceWorker;
  }

  public async reload(): Promise<void> {
    this.reloading = true;
    return this.updateServiceWorker(true);
  }

  public close(): void {
    this.offlineReady.value = false;
    this.needRefresh.value = false;
  }
}
</script>

<style lang="scss" scoped>
.pwa-notif {
  position: fixed;
  right: 1rem;
  top: 1rem;
  z-index: 2;
  margin: 0;
  padding: 1.25rem 1.5rem 1.25rem 1.5rem;
  background-color: var(--secondary);
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: .5rem;
}
</style>
