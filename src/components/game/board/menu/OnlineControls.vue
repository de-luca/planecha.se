<template>
  <DropdownMenu :open="isOpen" @update:open="isOpen = $event">
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
          <Button class="w-full" @click="attemptOpen">
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
			<InputGroup>
				<InputGroupInput type="text" v-model="roomUrl" readonly />
				<InputGroupAddon align="inline-end">
					<InputGroupButton 
						size="icon-xs"
						title="Copy"
						@click.prevent="copy"
					>
						<Clipboard v-if="copyBtnIdle" />
						<ClipboardCheck v-else />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
        </DropdownMenuLabel>
        <DropdownMenuLabel class="text-muted-foreground text-xs">
          Give this thing to people!
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel class="flex items-center gap-2">
          <UsersRound /> Current Players
        </DropdownMenuLabel>
        <DropdownMenuLabel>
          {{ store.playerName }} <em class="text-muted-foreground">(that's you!)</em>
        </DropdownMenuLabel>
        <DropdownMenuLabel v-for="[id, name] in store.mates" :key="id">
          {{ name }}
        </DropdownMenuLabel>
      </template>
    </DropdownMenuContent>
  </DropdownMenu>
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
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	BlockedError,
	OfflineError,
	ServerError,
	TimeoutError,
} from "@/model/net";
import { useMain, useUI } from "@/store";

type Issue = Partial<{ msg: string; cause: string }>;

const store = useMain();
const router = useRouter();
const { openPlayerName } = useUI();

const issue = ref<Issue>();
const isOpen = ref(false);
const copyBtnIdle = ref(true);

const online = computed(() => !!store.net);
const roomUrl = computed(() => {
	console.log(`${window.location.origin}/#/game/${store.gameId}`);
	return `${window.location.origin}/#/game/${store.gameId}`;
});

const copy = async () => {
	try {
		copyBtnIdle.value = false;
		await navigator.clipboard.writeText(roomUrl.value);
		setTimeout(() => {
			copyBtnIdle.value = true;
		}, 1000);
	} catch (err) {
		console.error(err);
	}
};

const digestError = (err: Error) => {
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

const attemptOpen = () => {
	if (!store.playerName) {
		openPlayerName(async () => {
			await open();
			isOpen.value = true;
		});
		isOpen.value = false;
	} else {
		open();
	}
};

const open = async () => {
	try {
		await store.open();
		console.log(store.gameId);
		router.replace({ name: "Join", params: { roomId: store.gameId } });
		copy();
		console.log(store.gameId);
	} catch (err) {
		digestError(err as Error);
	}
};
</script>
