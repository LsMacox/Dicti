<template>
  <div class="v-dicti-dialog" :class="{ show: modelValue }">
    <div class="overlay" @click="onClickOverlay" />
    <div class="card" :style="{ width: width + 'px', height: height + 'px' }">
      <div class="card-header">
        <slot name="append-icon" />
      </div>
      <div class="card-content">
        <slot />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 500,
    },
    height: {
      type: Number,
      default: 500,
    },
  },
  methods: {
    onClickOverlay() {
      this.$emit("update:modelValue", false)
    },
  },
})
</script>
<style lang="scss" scoped>
@use "sass:map";
@import "@/assets/sass/colors.scss";
@import "@/assets/sass/fonts.scss";
@import "@/assets/sass/variables.scss";

.v-dicti-dialog {
  visibility: hidden;
  &.show {
    visibility: visible;
    .overlay {
      opacity: 0.7;
    }
  }
  .overlay {
    transition: 0.1s;
    position: fixed;
    background: #ffe99d;
    opacity: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
  }
  .card {
    max-width: 100%;
    position: fixed;
    top: 50%;
    transform: translateY(-50%) translateX(-50%);
    left: 50%;
    background: map.get($colors, "primary");
    z-index: 11;
    border-radius: 15px;
    padding: 8px 11px;
    .card-header {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
