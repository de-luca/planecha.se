<template>
  <DropdownMenu>
    <DropdownMenuTrigger title="Online controls">
      <Button variant="ghost" class="w-[3.5rem]">
        <UserRoundCog class="!h-full !w-full" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="right" class="w-[25rem]">
      <template v-if="!online">
        <DropdownMenuLabel class="flex items-center gap-2">
          <DoorOpen /> Open Game
        </DropdownMenuLabel>
        <DropdownMenuLabel class="flex justify-between gap-1">
          <Button class="w-full" @click="open">
            Open Game to Multiplayer
          </Button>
        </DropdownMenuLabel>
        <DropdownMenuLabel class="text-muted-foreground text-xs">
          You need to open your game to invite people to join.
        </DropdownMenuLabel>
      </template>
      <template v-else>
        <DropdownMenuLabel class="flex items-center gap-2">
          <UserRoundPlus /> Invite players
        </DropdownMenuLabel>
        <DropdownMenuLabel class="flex w-full max-w-sm items-center gap-1.5">
          <Input type="text" v-model="roomUrl" readonly />
          <FeedbackButton variant="outline" size="icon" :timeout="1000" >
            <template v-slot:idle>
              <Clipboard />
            </template>
            <template v-slot:action>
              <ClipboardCheck />
            </template>
          </FeedbackButton>
        </DropdownMenuLabel>
        <DropdownMenuLabel class="text-muted-foreground text-xs">
          Give this thing to people!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel class="flex items-center gap-2">
          <UsersRound /> Current Players
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          {{ store.selfName }} <em class="text-muted-foreground">(that's you!)</em>
        </DropdownMenuLabel>
        <DropdownMenuLabel v-for="[id, name] in store.mates" :key="id">
          {{ name }}
        </DropdownMenuLabel>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>


  <!-- <div
    :class="{ 'is-active': active }"
    class="dropdown"
  >
    <tip>
      <template #btn>
        <div class="dropdown-trigger">
          <button
            @click="active = !active"
            @keyup.space.prevent
            class="button is-ghost"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <fa icon="user-plus" fixed-width size="lg"/>
          </button>
        </div>
      </template>
      <template #tip>Online controls</template>
    </tip>

    <div class="click-trap" @click="active = false"></div>

    <div class="dropdown-menu is-side" id="dropdown-menu" role="menu">
      <div class="dropdown-content">
        <div v-if="!online" class="dropdown-item">
          <div class="field">
            <label class="label">
              <fa icon="torii-gate" fixed-width />
              Open Game
            </label>
            <div class="field">
              <div class="control is-expanded">
                <button class="button is-secondary is-fullwidth" @click="open">
                  Open Game to Multiplayer
                </button>
              </div>
            </div>
            <p class="help" v-if="!issue">You need to open your game to invite people to join.</p>
            <p class="help is-danger" v-else>
              <b>{{ issue.msg }}</b><br>
              {{ issue.cause }}
            </p>
          </div>
        </div>

        <template v-else>
          <div class="dropdown-item">
            <div class="field">
              <label class="label">
                <fa icon="user-plus" fixed-width />
                Invite players
              </label>
              <div class="field has-addons">
                <div class="control is-expanded">
                  <input class="input" type="text" :value="roomUrl" readonly>
                </div>
                <div class="control">
                  <feedback-button
                    @click="copy"
                    id="copy"
                    class="button"
                    idleText="Copy"
                    actionText="Copied!"
                    timeout="5000"
                  />
                </div>
              </div>
              <p class="help">Give this thing to people!</p>
            </div>
          </div>

          <hr class="dropdown-divider">

          <div class="dropdown-item">
            <p class="label">
              <fa icon="users" fixed-width />
              Current Players
            </p>
            <p>{{ playerName }} (You)</p>
            <p v-for="[id, name] in mates" :key="id">{{ name }}</p>
          </div>
        </template>
      </div>
    </div>
  </div>

  <name-modal v-model:active="nameModalActive" @done="open" /> -->
</template>

<script setup lang="ts">
import {
	Clipboard,
	ClipboardCheck,
	DoorOpen,
	UserRoundCog,
	UserRoundPlus,
	UsersRound,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import FeedbackButton from "@/components/controls/FeedbackButton.vue";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

import {
	BlockedError,
	OfflineError,
	ServerError,
	TimeoutError,
} from "@/model/net";
import { useMain } from "@/store/main";

type Issue = Partial<{ msg: string; cause: string }>;

const store = useMain();
const router = useRouter();

const issue = ref<Issue>();

const online = computed(() => !!store.net);
const roomUrl = computed(() => {
	console.log(`${window.location.origin}/@/game/${store.gameId}`);
	return `${window.location.origin}/@/game/${store.gameId}`;
});

const copy = async () => {
	try {
		await navigator.clipboard.writeText(roomUrl.value);
	} catch (err) {
		console.error(err);
	}
};

const digestError = (err: Error) => {
	console.log(err);
	issue.value = { msg: "The game could not be oppened." };
	switch (true) {
		case err instanceof TimeoutError:
			issue.value.cause =
				"The link might be broken or the room as been closed.";
			break;
		case err instanceof OfflineError:
			issue.value.cause = "Your browser appears to be offline.";
			break;
		case err instanceof BlockedError:
			issue.value.cause = `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
        You can try fixing this issue by deactivating your adblocker.`;
			break;
		case err instanceof ServerError:
			issue.value.cause = "The signaling server might be down.";
			break;
	}
};

const open = async () => {
	try {
		await store.open();
		router.replace({ name: "Join", params: { roomId: store.gameId } });
		copy();
		console.log(store.gameId);
	} catch (err) {
		digestError(err as Error);
	}
};

// import { Component, Vue } from "vue-facing-decorator";
// import { useMain } from "@/store/main";

// import NameModal from "@/components/NameModal.vue";
// import FeedbackButton from "@/components/controls/FeedbackButton.vue";
// import {
// 	BlockedError,
// 	OfflineError,
// 	ServerError,
// 	TimeoutError,
// } from "@/model/net";

// enum BtnText {
// 	IDLE = "Copy",
// 	SUCCESS = "Copied!",
// }

// type Issue = { msg: string; cause: string };

// @Component({ components: { FeedbackButton, NameModal } })
// export default class OnlineControls extends Vue {
// 	private store = useMain();
// 	private copyBtnText: BtnText = BtnText.IDLE;

// 	public issue: Issue | null = null;
// 	public active = false;
// 	public nameModalActive = false;

// 	public get online(): boolean {
// 		return !!this.store.net;
// 	}

// 	public get playerName(): string {
// 		return this.store.selfName!;
// 	}

// 	public get roomUrl(): string {
// 		return `${window.location.origin}/@/game/${this.store.gameId}`;
// 	}

// 	public get mates(): Map<string, string> {
// 		return this.store.mates;
// 	}

// 	public async open(): Promise<void> {
// 		if (!this.store.selfName) {
// 			this.nameModalActive = true;
// 			return;
// 		}

// 		try {
// 			await this.store.open();
// 			this.$router.replace({
// 				name: "Join",
// 				params: { roomId: this.store.gameId },
// 			});
// 			this.copy();
// 		} catch (err) {
// 			this.digestError(err as Error);
// 		}
// 	}

// 	public async copy(): Promise<void> {
// 		try {
// 			await navigator.clipboard.writeText(this.roomUrl);
// 		} catch (err) {
// 			console.error(err);
// 		}
// 	}

// 	private digestError(err: Error): void {
// 		console.log(err);
// 		const issue: Partial<Issue> = { msg: "The game could not be oppened." };
// 		switch (true) {
// 			case err instanceof TimeoutError:
// 				issue.cause = "The link might be broken or the room as been closed.";
// 				break;
// 			case err instanceof OfflineError:
// 				issue.cause = "Your browser appears to be offline.";
// 				break;
// 			case err instanceof BlockedError:
// 				issue.cause = `This might be due to adblocker blocking public webtorrent relays for unknown reason.<br>
// 					You can try fixing this issue by deactivating your adblocker.`;
// 				break;
// 			case err instanceof ServerError:
// 				issue.cause = "The signaling server might be down.";
// 				break;
// 		}
// 		this.issue = issue as Issue;
// 	}
// }
</script>
