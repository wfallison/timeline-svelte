<script lang="ts">
    import { text } from 'svelte/internal';
    import { spring } from 'svelte/motion';
    import { articleResults } from '../stores';
    //export let articleResults;
    import Button, { Group, Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import Icon from '@smui/textfield/icon';
    import HelperText from '@smui/textfield/helper-text';
 
    let searchString: string | null = null;
    
    const makeRequest = async function () {
        console.log('clicked')
        fetch(`http://localhost:3001/wikiTime/${searchString}`)
            .then(async (data)=>{
                $articleResults = await data.json();
            })
    }

        let focused = false;
        let value: string | null = null;
        let dirty = false;
        let invalid = false;
      
    </script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
    />

    <div style="margin:auto;">
    <Textfield bind:value={searchString}></Textfield >
    <Button on:click={makeRequest} variant="raised">
        <Label>Search</Label>
    </Button>
    </div>

    <style></style>