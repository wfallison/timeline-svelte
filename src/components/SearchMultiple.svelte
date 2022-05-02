<script lang="ts">
    import { articleResults, loading, searchCriteria } from '../stores';
    //export let articleResults;
    import Button, { Group, Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import { fade } from 'svelte/transition';
    import Autocomplete from '@smui-extra/autocomplete';
    import { Text } from '@smui/list';
    import CircularProgress from '@smui/circular-progress';
	import Fab, { Icon } from '@smui/fab';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    export let open = false;

    console.log(process.env.API_URL)

    $: searchTerm = '';
    $: searchArray = [];

    $: autoCompleteData = [];

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

        value = '';
        autoCompleteData = [];

        $searchCriteria = searchArray

        //fetch(`http://localhost:3000/api/w`
        fetch(`${process.env.API_URL}/api/w`
        , {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(searchArray),
        })
            .then(async (data)=>{
                const results = await data.json();
                $articleResults = results;
                $loading = false;
            })

    }

    let timeout:any = null;

    const articleLookup = async function(searchTerm:any) {

        clearTimeout(timeout);

        timeout = setTimeout(function () {
            fetch(`${process.env.API_URL}/api/lookup?searchTerm=${searchTerm}`
            , {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
            })
            .then(async (data)=>{
                const results = await data.json();
                const pages = results.query.allpages
                autoCompleteData = pages.map((el:any) =>{
                    return {
                        text: el.title,
                        value: el.pageid
                    }
                })
            })
        }, 250);
    };


    let value: string | undefined = undefined;
 
  let counter = 0;
 
  async function searchItems(input: string) {
    if (input === '') {
      return [];
    }
 

    // Pretend to have some sort of canceling mechanism.
    const myCounter = ++counter;
    let autoCompleteData_Arr
 
    // Pretend to be loading something...
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    await fetch(`${process.env.API_URL}/api/lookup?searchTerm=${input}`
            , {
                method: 'GET',
                headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
                }
            })
            .then(async (data)=>{
                const results = await data.json();
                const pages = results.query.allpages
                autoCompleteData_Arr = pages.map((el:any) =>{
                    return el.title
                })
            })
 
    if (myCounter !== counter) {
      // This means the function was called again, so we should cancel.
      // This is how you tell Autocomplete to cancel this search. It won't
      // replace the results of any subsequent search that has already finished.
      return false;
    }
 
    // Return a list of matches.
    // return fruits.filter((item) =>
    //   item.toLowerCase().includes(input.toLowerCase())
    // );
    return autoCompleteData_Arr;
  }

let lostFocus = false;

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
        class="secondary"
        on:click={() => autoCompleteData = []}
    >
    <!-- on:click={() => autoCompleteData = []} -->
        <Title id="large-scroll-title">Add articles to your timeline</Title>
        <Content id="large-scroll-content">
            
            <div>
                <div style="margin-top:1em;display:flex;">
                     <div style="width: 100%;">
                        <Autocomplete
                          search={searchItems}
                          bind:value
                          showMenuWithNoInput={false}
                          label="Search Criteria"
                        >
                          <Text
                            slot="loading"
                            style="display: flex; width: 90%; justify-content: center; align-items: center;"
                          >
                            <CircularProgress style="height: 5em; width: 5em;" indeterminate />
                          </Text>
                        </Autocomplete>
                      </div>
                     <!-- {/if} -->
                    <Button on:click={() => addNewEntry(value)} touch variant="raised" style="float:right; margin-top: 1em;">
                        <Label>Add</Label>
                    </Button>
                </div>
            </div>
            <div style="margin-top:5em;">
                {#each searchArray as entry, i}
                    <div style="margin-top:3em;">
                        <Textfield style="width: 75%;"
                            variant="outlined" 
                            bind:value={entry.articleTitle} 
                            label="Search Term">
                        </Textfield>

                        <Button on:click={() => removeEntry(i)}  touch variant="raised" style="width: 20%; float:right;">
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
        
            <Button on:click={makeRequest} touch variant="raised" style="float:right">
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
   
    <!-- <Button on:click={() => (open = true)} touch variant="outlined" style="width:100%">
    <Label>Add more articles to search</Label>
    </Button>
     -->
     <div class="flexy" style="bottom: 2em;
    position: fixed;
    right: 2em;">
		<div class="margins">
		  <Fab style="width:5em;height:5em;" on:click={() => (open = true)}>
			<Icon style="font-size:2.5em" class="material-icons">manage_search</Icon>
		  </Fab>
		</div>
	  </div>

    <style>
    .mdc-text-field .smui-text-field--standard{
        width: 100% !important;
    }
    </style>