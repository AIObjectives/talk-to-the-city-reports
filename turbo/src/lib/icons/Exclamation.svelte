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

<svg
  xmlns="http://www.w3.org/2000/svg"
  {height}
  {viewBox}
  {width}
  class={className}
  aria-label={ariaLabel}
  aria-hidden={ariaHidden}
>
  {#if desc}<desc>{desc}</desc>{/if}{#if title}<title>{title}</title>{/if}
  <path
    d="M0.1 19.7586V2C0.1 1.47673 0.285148 1.03127 0.658211 0.658211C1.03127 0.285148 1.47673 0.1 2 0.1H18C18.5233 0.1 18.9687 0.285148 19.3418 0.658211C19.7149 1.03127 19.9 1.47673 19.9 2V14C19.9 14.5233 19.7149 14.9687 19.3418 15.3418C18.9687 15.7149 18.5233 15.9 18 15.9H4H3.95858L3.92929 15.9293L0.1 19.7586ZM18 14.1H18.1V14V2V1.9H18H2H1.9V2V15.125V15.3627L2.06993 15.1965L3.19078 14.1H18ZM10.6418 12.6418C10.4698 12.8138 10.2582 12.9 10 12.9C9.74185 12.9 9.5302 12.8138 9.35821 12.6418C9.18622 12.4698 9.1 12.2582 9.1 12C9.1 11.7418 9.18622 11.5302 9.35821 11.3582C9.5302 11.1862 9.74185 11.1 10 11.1C10.2582 11.1 10.4698 11.1862 10.6418 11.3582C10.8138 11.5302 10.9 11.7418 10.9 12C10.9 12.2582 10.8138 12.4698 10.6418 12.6418ZM10.9 8.9H9.1V3.1H10.9V8.9Z"
    fill={color}
    stroke={color}
    stroke-width="0.2"
  />
</svg>
