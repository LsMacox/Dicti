<template>
  <div v-click-outside="onClickOutside" ref="dropdown" class="v-dicti-dropdown">
    <slot :on="{ toggle }" :bind="{ activeItem }"></slot>
    <Teleport :disabled="!absolute" to="#app">
      <ul
        ref="list"
        v-if="internalModelValue"
        class="v-dicti-dropdown__list"
        :style="compStyleList"
      >
        <li class="v-item" v-for="item in items" :key="item['key']">
          <a
            :style="compStyleItem"
            :class="{
              'v-href': true,
              'v-href--hide': hideNotActiveItem,
              'v-href--active':
                JSON.stringify(item) == JSON.stringify(activeItem),
            }"
            :href="item['href'] ?? '#'"
            @click.prevent="onClickItem(item)"
            >{{ item["key"] }}
          </a>
        </li>
      </ul>
    </Teleport>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"
import type { PropType } from "vue"
import type { IDropdownItem, Align, IStyles } from "@/interfaces"
import AttachPosition from "@/mixins/attach-position.js"

export default defineComponent({
  mixins: [AttachPosition],
  emits: ["update:modelValue", "click-item", "clickOutside"],
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array as PropType<IDropdownItem[]>,
      required: true,
    },
    width: {
      type: String,
      default: "",
    },
    align: {
      type: String as PropType<Omit<Align, "start" | "center">>,
      default: "start",
    },
    absolute: Boolean,
    hideNotActiveItem: Boolean,
  },
  data() {
    return {
      internalModelValue: this.modelValue,
      activeItem: this.items[0] as IDropdownItem,
    }
  },
  watch: {
    modelValue(value: boolean) {
      this.internalModelValue = value
    },
    internalModelValue(value: boolean) {
      this.$emit("update:modelValue", value)
    },
  },
  computed: {
    compStyleList() {
      const styles: IStyles = {}
      styles.textAlign = this.align
      styles.width = this.width

      if (this.absolute) styles.position = "absolute"

      return styles
    },
    compStyleItem() {
      const styles: IStyles = {}

      if (this.align == "center") styles.margin = 0

      return styles
    },
  },
  methods: {
    async toggle() {
      this.internalModelValue = !this.internalModelValue

      await this.$nextTick()

      if (this.absolute) {
        this.attachPosition(this.$refs.list, this.$refs.dropdown, {
          left: -15,
          top: 20,
        })
      }
    },
    onClickItem(item: IDropdownItem) {
      this.activeItem = item
      this.$emit("click-item", item)
    },
    onClickOutside(event: any) {
      var target = event.target
      var parentNodes = []
      while (target) {
        parentNodes.unshift(target)
        target = target.parentNode
      }

      const isClickOnList = parentNodes.some((node) => node == this.$refs.list)

      if (!isClickOnList) {
        this.$emit("clickOutside")
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.v-dicti-dropdown {
  position: relative;
  .v-dicti-dropdown__list {
    position: absolute;
  }
}
</style>
