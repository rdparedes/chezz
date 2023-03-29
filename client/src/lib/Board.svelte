<script lang="ts">
  import { onMount } from 'svelte';
  import { loadImage } from 'src/lib/loadImage';
  import { SQUARE_SIZE, drawPiece } from './piece';
  import type { BoardState } from './board';

  export let boardState: BoardState;

  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const ctx = canvas?.getContext('2d');
    const squareLightImage = await loadImage('src/assets/square_gray_light.png');
    const squareDarkImage = await loadImage('src/assets/square_gray_dark.png');

    for (let i = 0; i < 72; i++) {
      if (i % 2 == 0) {
        ctx.drawImage(
          squareLightImage,
          (i % 9) * SQUARE_SIZE,
          Math.floor(i / 9) * SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
      } else {
        ctx.drawImage(
          squareDarkImage,
          (i % 9) * SQUARE_SIZE,
          Math.floor(i / 9) * SQUARE_SIZE,
          SQUARE_SIZE,
          SQUARE_SIZE
        );
      }
    }

    boardState?.pieces?.map((p) => drawPiece(p, ctx));
  });

  // Render the board pieces when the board state changes
  $: {
    const ctx = canvas?.getContext('2d');
    boardState?.pieces?.map((p) => drawPiece(p, ctx));
  }
</script>

<canvas bind:this={canvas} width="768" height="768" />

<style>
  canvas {
    width: 100%;
  }
</style>
