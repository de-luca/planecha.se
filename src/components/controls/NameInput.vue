<template>
  <div class="field">
    <label class="label" v-html="label"></label>
    <div class="field has-addons">
      <div class="control">
        <input
            v-model="name"
            class="input"
            type="text"
            placeholder="Fblthp"
            :required="required"
          >
      </div>
      <div class="control">
        <a class="button is-primary" @click="randomize" title="Randomize name">
          <fa icon="dice-d20" fixed-width />
        </a>
      </div>
    </div>
    <p class="help" v-if="help" v-html="help"></p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-facing-decorator';

const ADJS = [
  'Nuclear', 'Dystopian', 'Phyrexian', 'Super rare adjective',

  'Deathtouching', 'Double striking', 'First striking', 'Flying', 'Hexproofed', 'Indestructible',
  'Lifelinking', 'Menacing', 'Reaching', 'Trampling', 'Vigilant',

  'Admiring', 'Adoring', 'Affectionate', 'Agitated', 'Amazing', 'Angry', 'Awesome', 'Beautiful',
  'Blissful', 'Bold', 'Boring', 'Brave', 'Busy', 'Charming', 'Clever', 'Compassionate', 'Competent',
  'Condescending', 'Confident', 'Cool', 'Cranky', 'Crazy', 'Dazzling', 'Determined', 'Distracted',
  'Dreamy', 'Eager', 'Ecstatic', 'Elastic', 'Elated', 'Elegant', 'Eloquent', 'Epic', 'Exciting',
  'Fervent', 'Festive', 'Flamboyant', 'Focused', 'Friendly', 'Frosty', 'Funny', 'Gallant', 'Gifted',
  'Goofy', 'Gracious', 'Great', 'Happy', 'Hardcore', 'Heuristic', 'Hopeful', 'Hungry', 'Infallible',
  'Inspiring', 'Intelligent', 'Interesting', 'Jolly', 'Jovial', 'Keen', 'Kind', 'Laughing', 'Loving',
  'Lucid', 'Magical', 'Modest', 'Musing', 'Mystifying', 'Naughty', 'Nervous', 'Nice', 'Nifty', 'Nostalgic',
  'Objective', 'Optimistic', 'Peaceful', 'Pedantic', 'Pensive', 'Practical', 'Priceless', 'Quirky',
  'Quizzical', 'Recursing', 'Relaxed', 'Reverent', 'Romantic', 'Sad', 'Serene', 'Sharp', 'Silly',
  'Sleepy', 'Stoic', 'Strange', 'Stupefied', 'Suspicious', 'Sweet', 'Tender', 'Thirsty', 'Trusting',
  'Unruffled', 'Upbeat', 'Vibrant', 'Vigilant', 'Vigorous', 'Wizardly', 'Wonderful', 'Xenodochial',
  'Youthful', 'Zealous', 'Zen',
];

const NOUNS = [
  'Penguin', 'Waffle', 'Unicorn', 'Duck',

  'Dragon', 'Zombie', 'Elf', 'Goblin', 'Angel', 'Sliver', 'Dinosaur', 'Cat', 'Phyrexian',
  'Spirit', 'Eldrazi', 'Myr', 'Dwarf', 'Ooze', 'Kithkin', 'Atog', 'Plant', 'Fungus',

  'Ajani', 'Aminatou', 'Nahiri', 'Ashiok', 'Teferi', 'Chandra', 'Comet', 'Daretti',
  'Elspeth', 'Estrid', 'Freyalise', 'Grist', 'Huatli', 'Jace', 'Vraska', 'Karn', 'Liliana',
  'Niko', 'Nissa', 'Oko', 'Ral', 'Saheeli', 'Tomik', 'Alesha', 'Tamiyo', 'Tezzeret',
  'Ugin', 'Urza', 'Mishra', 'Breena', 'Windgrace', 'Niv-Mizzet', 'Fblthp', 'Colossal Dreadmaw',
  'Storm Crow', 'Homunculus', 'Marit Lage',

  '[object Object]',
];

@Component({ emits: ['update:modelValue'] })
export default class NameInput extends Vue {
  @Prop({ required: true })
  public modelValue: string;

  @Prop({ required: true })
  public label: string;

  @Prop({ required: false })
  public help: string;

    @Prop({ required: false, default: false })
  public required: boolean;

  public get name(): string {
    return this.modelValue;
  }

  public set name(value: string) {
    this.$emit('update:modelValue', value);
  }

  public randomize(): void {
    const adj = ADJS[Math.floor(Math.random() * ADJS.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    this.name = `${adj} ${noun}`;
  }
}
</script>

<style lang="scss" scoped>
.field.has-addons .control:first-child {
  flex-grow: 1;
}
</style>
