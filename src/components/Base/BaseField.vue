<template>
  <div class="v-dicti-field" :style="{ width: width, height: height }">
    <div class="v-input__control">
      <fieldset aria-hidden="true"></fieldset>
      <div class="v-text-field__slot">
        <input
          v-model="internalValue"
          @keyup.enter="onEmit('enter', $event)"
          type="text"
          :placeholder="placeholder"
        />
        <label class="v-label">{{ label }}</label>
      </div>
      <BaseIcon
        class="v-icon"
        @click="onEmit('iconClick', $event)"
        v-if="icon"
        :icon="icon"
        width="24"
        height="24"
      ></BaseIcon>
    </div>
  </div>
</template>
<script lang="ts">
import BaseIcon from "@/components/Base/BaseIcon.vue"
import { defineComponent } from "vue"

export default defineComponent({
  components: {
    BaseIcon,
  },
  emits: ["update:value", "iconClick", "enter"],
  props: {
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    height: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      internalValue: this.value,
    }
  },
  watch: {
    internalValue(value: string) {
      this.$emit("update:value", value)
    },
  },
  methods: {
    onEmit(emitName: string, event: Event): void {
      this.internalValue = ""
      this.$emit(emitName, event)
    },
  },
})
</script>
<style lang="scss" scoped>
@use "sass:map";
@import "@/assets/sass/fonts.scss";
@import "@/assets/sass/colors.scss";

.v-dicti-field {
  .v-input__control {
    padding-right: 16px;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    height: auto;
    justify-content: flex-start;
    flex-direction: row;
    align-items: center;
  }
  fieldset {
    border-collapse: collapse;
    border: 1px solid map.get($colors, "primary");
    bottom: 0;
    left: 0;
    pointer-events: none;
    position: absolute;
    right: 0;
    top: 0;
    transition-duration: 0.15s;
    transition-property: color;
    transition-timing-function: cubic-bezier(0.25, 0.8, 0.25, 1);
    color: red;
    border-radius: 5px;
  }
  .v-text-field__slot input {
    padding: 16px 0 16px 16px;
    height: auto;
    background: transparent;
    border: none;
    font-size: map.get($font-sizes, "xsm");
    color: map.get($colors, "secondary");
    &::placeholder {
      color: map.get($colors, "secondary");
    }
    &:focus {
      outline: none;
    }
  }
  .v-icon {
    cursor: pointer;
  }
}
</style>
