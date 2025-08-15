<script lang="ts">
  interface Props {
    title: string;
    description: string;
    children?: import('svelte').Snippet;
  }

  const { title, description, children }: Props = $props();
</script>

<section class="bg-base-100 mb-8 rounded-lg p-6 shadow-lg">
  <h2 class="text-base-content mb-4 text-2xl font-bold">{title}</h2>
  <p class="text-base-content/70 mb-6">{description}</p>

  {#if children}
    {@render children()}
  {/if}
</section>
