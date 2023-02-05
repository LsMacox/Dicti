<template>
  <IconifyIcon
    class="v-dicti-icon"
    :icon="icons[icon as keyof typeof icons]"
    :color="color"
    :inline="inline"
    :width="width"
    :heigh="height"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue"
import { Icon as IconifyIcon } from "@iconify/vue"

// Icons
import searchIcon from "@iconify-icons/mdi/search"
import roundArrowDropDown from "@iconify-icons/ic/round-arrow-drop-down"
import arrowLeft from "@iconify-icons/material-symbols/arrow-left"
import arrowRight from "@iconify-icons/material-symbols/arrow-right"
import closeOutline from "@iconify-icons/ion/close-outline"
import repeatOutline from "@iconify-icons/ion/repeat-outline"

export default defineComponent({
  components: {
    IconifyIcon,
  },
  props: {
    icon: {
      type: String,
      default: "",
    },
    inline: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: "secondary",
    },
    width: {
      type: [String, Number],
      default: 12,
    },
    height: {
      type: [String, Number],
      default: 7,
    },
  },
  data() {
    return {
      icons: {
        search: searchIcon,
        arrowDown: roundArrowDropDown,
        arrowLeft: arrowLeft,
        arrowRight: arrowRight,
        close: closeOutline,
        repeat: repeatOutline,
      },
    }
  },
  mounted() {},
})
</script>
