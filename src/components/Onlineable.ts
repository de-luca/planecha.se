import { Vue } from 'vue-class-component';
import { Beacon } from '@/model/net/Beacon';

export class Onlineable extends Vue {
  protected online: boolean = navigator.onLine;
  protected loading = true;
  protected available = false;

  protected get helpText(): string {
    if (!window.WebSocket) {
      return 'Online unavailable. No WebSocket support.';
    }

    if (!this.online) {
      return 'Online unavailable. You are not connected to the Internets!';
    }

    if (this.loading) {
      return 'Checking the Planar Beacon...';
    }

    if (!this.available) {
      return 'Online unavailable. 🔥 Server is dead 🔥';
    }

    return '';
  }

  protected registerOnlineListener(): void {
    this.handleOnline();
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOnline);
  }

  protected removeOnlineListener(): void {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOnline);
  }

  protected handleOnline(): void {
    this.online = navigator.onLine;
    Beacon.check()
      .then(state => this.available = state)
      .finally(() => this.loading = false);
  }
}
