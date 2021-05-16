<template>
    <div class="field">
        <label class="label">{{ label }}</label>

        <div class="control">
            <template v-for="option in options" :key="option.value">
                <input
                    type="radio"
                    :id="option.label"
                    :value="option.value"
                    v-model="selected"
                >
                <label class="button" :for="option.label">{{ option.label }}</label>
            </template>
        </div>

        <p class="help" v-html="currentHelp"></p>
    </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Options, Vue, prop } from 'vue-class-component';

export interface Option {
    label: string;
    value: string;
    help?: string;
}

class Props {
  public modelValue = prop<string>({ required: true });
  public label = prop<string>({ required: true });
  public options = prop<Array<Option>>({ required: true });
}

@Options({
  emits: ['update:modelValue'],
})
export default class ButtonPicker extends Vue.with(Props) {
  public get selected(): string {
    return this.modelValue;
  }
  
  public set selected(value: string) {
    this.$emit('update:modelValue', value);
  }

  public get currentHelp(): string {
    return this.options.find((o: Option) => o.value === this.selected)?.help ?? '';
  }


  public mounted() {
    const { game } = mapGetters(['game']);
    console.log(game);
    // console.log('mutation');
    // console.log('mounted', this.game.map.deck.length)
    // this.$store.commit('GAME_INIT')
    // console.log('mounted', this.game.map.deck.length)
    // console.log(this.selected);
  }
}

// export default defineComponent({
//   props: {
//     modelValue: {
//       type: String,
//       required: true,
//     },
//     label: {
//       type: String,
//       required: true,
//     },
//     options: {
//       type: Object as PropType<Array<Option>>,
//       required: true,
//       default: () => { /* NOOP */ },
//     },
//   },
//   emits: [
//     'update:modelValue',
//   ],
//   computed: {
//     selected: {
//       get(): string {
//         return this.modelValue;
//       },
//       set(value: string) {
//         this.$emit('update:modelValue', value);
//       },
//     },
//     currentHelp(): string {
//       return this.options
//         .find((o: Option) => o.value === this.selected)
//                 ?.help ?? '';
//     },
//     ...mapGetters(['game']),
//   },

//   mounted() {

//     console.log('mutation');
//     console.log('mounted', this.game.map.deck.length)
//     this.$store.commit('GAME_INIT')
//     console.log('mounted', this.game.map.deck.length)
//     console.log(this.selected);
    

//   }
// });
</script>

<style lang="scss" scoped>
.field {
    button {
        width: 150px;
    }

    .control {
        display: inline-flex;
        gap: 1rem;

        label {
            width: 150px;
        }
    }
}

input[type="radio"] {
    display: none;

    &:checked+label {
        border-color: #4a4a4a;
        color: #363636;
    }
}
</style>
