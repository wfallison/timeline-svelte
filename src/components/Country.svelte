<script>
    export let itemLabel;
    export let highlighted;
  </script>
  
  <style>

  </style>
  
  <li class="autocomplete-items" class:autocomplete-active={highlighted} on:click>{@html itemLabel}</li>