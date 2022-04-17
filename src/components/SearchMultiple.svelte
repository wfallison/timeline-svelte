<script lang="ts">
    import { articleResults, loading } from '../stores';
    //export let articleResults;
    import Button, { Group, Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import { fade } from 'svelte/transition';

    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    export let open = false;
    export let hideButton = false;
    

    $: searchTerm = '';
    $: searchArray = [];

	function spin(node, { duration }) {
		return {
			duration,
			css: t => ``
		};
	}

    const removeEntry = function(itemIndex: number){
        searchArray.splice(itemIndex, 1)
        searchArray = searchArray;
    };
        
    const addNewEntry = function(searchParam: string){
        searchArray.push({
            articleTitle: searchParam
        })
        searchArray = searchArray;
        searchTerm = '';
    };

    const removeAllEntries = function(){
        searchArray = [];
        searchArray = searchArray;
    };

    const makeRequest = async function () {
        $loading = true;
        open = false;

        fetch(`http://localhost:3001/wikiTime/searchMultiple/`
        , {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchArray),
        })
            .then(async (data)=>{
                $articleResults = await data.json();
                $loading = false;
            })

    }
     
    </script>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
    />

    {#if open}
    <div in:spin="{{duration: 8000}}" out:fade>

    <Dialog
        bind:open
        aria-labelledby="large-scroll-title"
        aria-describedby="large-scroll-content"
        surface$style="width: 850px; max-width: calc(100vw - 32px);"
        class="
        secondary"
        
    >
        <Title id="large-scroll-title">Add articles to your timeline</Title>
        <Content id="large-scroll-content">
            
            <div>

                <div style="margin-top:1em;">
                    <Textfield style="width: 75%;"
                        variant="outlined" 
                        bind:value={searchTerm} 
                        label="Enter the title of an article">
                    </Textfield>
                    <Button on:click={() => addNewEntry(searchTerm)}  touch variant="raised" style="float:right">
                        <Label>Add</Label>
                    </Button>
                </div>
                <span>Titles can be derived from the end of the wikipedia article's URL</span>

            </div>
        </Content>
        <Content>
            <div>
                {#each searchArray as entry, i}
                    <div style="margin-top:1em;">
                        <Textfield style="width: 75%;"
                            variant="outlined" 
                            bind:value={entry.articleTitle} 
                            label="Search Term">
                        </Textfield>

                        <Button on:click={() => removeEntry(i)}  touch variant="raised" style="float:right">
                            <Label>Remove</Label>
                        </Button>
                    </div>
                {/each}
            </div>
            
        </Content>
        <!-- <Actions> -->
        <div style="margin:2em">
            <Button on:click={() => removeAllEntries()} touch variant="raised" style="float:left">
                <Label>Clear All</Label>
            </Button>
        
            <Button on:click={makeRequest} touch variant="raised" class="secondarybutton" style="float:right">
                <Label>Search</Label>
            </Button>
            <Button on:click={() => open = false} touch variant="raised" style="float:right; margin-right:5px;">
                <Label>Close</Label>
            </Button>
        </div>
        <!-- </Actions> -->

            
    
    </Dialog>
    </div>
    {/if}
   
    <Button on:click={() => (open = true)} touch variant="raised" style="width:100%">
    <Label>Add more articles to search</Label>
    </Button>
    

    <style></style>