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
    d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"
    fill={color}
  /></svg
>
