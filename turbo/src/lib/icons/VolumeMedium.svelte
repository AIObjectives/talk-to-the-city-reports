<script>
  export let size = '1em';
  export let width = size;
  export let height = size;
  export let color = 'currentColor';
  export let viewBox = '0 0 24 24';
  export let ariaLabel = void 0;
  export let ariaHidden = void 0;
  export let title = void 0;
  export let desc = void 0;

  let className = void 0;
  export { className as class };
</script>

<svg {viewBox} {width} {height} class={className} aria-label={ariaLabel} aria-hidden={ariaHidden}
  >{#if desc}<desc>{desc}</desc>{/if}{#if title}<title>{title}</title>{/if}<path
    d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
    fill={color}
  /></svg
>
