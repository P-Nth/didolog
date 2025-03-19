<!--
  IconStyle Component
  -------------------
  This component is used to provide consistent styling for all icons across your application.
  It wraps any icon content passed via its default slot and applies universal styles for size,
  width, and height.

  Props:
    - size (string): Sets the font size for the icon. Default is "16px".
    - width (string): Sets the width of the icon container. Default is "16px".
    - height (string): Sets the height of the icon container. Default is "16px".

  Usage Example:
    <script>
      import IconStyle from './IconStyle.svelte';
      import { FaUser } from 'svelte-icons/fa';
    </script>

    <IconStyle size="20px" width="20px" height="20px">
      <FaUser />
    </IconStyle>
-->
<script>
  // Props to customize the icon dimensions.
  export let size = "14px";
  export let width = "14px";
  export let height = "14px";
</script>

<!-- A span parent for the content in slot -->
<span
        class="icon-style inline-flex items-center justify-center"
        style="font-size: {size}; width: {width}; height: {height};"
>
  <slot />
</span>

