<script lang="ts">
  import { toBoardState } from './lib/board';
  import Board from './lib/Board.svelte';
  import { createNewGameSession } from './wsHandler';

  let isPlaying = false;
  let boardState = {};

  function onWSMessage(message: string) {
    boardState = toBoardState(message);
  }

  async function handlePlayClick(_event) {
    await createNewGameSession({ onMessageCallback: onWSMessage });
    isPlaying = true;
  }
</script>

<main>
  <h1>ƛ Lambda Chess</h1>
  <button on:click={handlePlayClick}>Play</button>
  {#if isPlaying}
    <div class="card">
      <Board boardState={boardState} />
    </div>
  {/if}
</main>

<style>
  /* .read-the-docs {
    color: #888;
  } */
</style>
