<script lang="ts">
    import { articleResults, loading, searchCriteria } from '../stores';
    //export let articleResults;
    import Button, { Group, Label } from '@smui/button';
    import Textfield from '@smui/textfield';
    import { fade } from 'svelte/transition';

    import Country from './Country.svelte';	

    import Dialog, { Title, Content, Actions } from '@smui/dialog';

    export let open = false;
    export let hideButton = false;
    

    $: searchTerm = '';
    $: searchArray = [];

    let autoCompleteData = [];

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

        $searchCriteria = searchArray

        //fetch(`http://localhost:3000/api/w`
        fetch(`https://api-routes-cors-jet.vercel.app/api/w`
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
            fetch(`https://api-routes-cors-jet.vercel.app/api/lookup?searchTerm=${searchTerm}`
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
                        pageId: el.pageid,
                        title: el.title
                    }
                })
            })
        }, 1000);
    };

    const clearInput = () => {
        searchTerm = "";	
        searchInput.focus();
    }

    const setInputVal = (countryName) => {
        searchTerm = removeBold(countryName);
        autoCompleteData = [];
        hiLiteIndex = null;
        document.querySelector('#search').focus();
    }	

    const submitValue = () => {
        if (searchTerm) {
            console.log(`${searchTerm} is submitted!`);
            setTimeout(clearInput, 1000);
        } else {
            alert("You didn't type anything.")
        }
    }

    const makeMatchBold = (str) => {
	// replace part of (country name === inputValue) with strong tags
	let matched = str.substring(0, inputValue.length);
	let makeBold = `<strong>${matched}</strong>`;
	let boldedMatch = str.replace(matched, makeBold);
	return boldedMatch;
}

const removeBold = (str) => {
	//replace < and > all characters between
	return str.replace(/<(.)*?>/g, "");
	// return str.replace(/<(strong)>/g, "").replace(/<\/(strong)>/g, "");
}	
     
let hiLiteIndex = null;
//$: hiLitedCountry = filteredCountries[hiLiteIndex]; 	


// const navigateList = (e) => {
// 	if (e.key === "ArrowDown" && hiLiteIndex <= filteredCountries.length-1) {
// 		hiLiteIndex === null ? hiLiteIndex = 0 : hiLiteIndex += 1
// 	} else if (e.key === "ArrowUp" && hiLiteIndex !== null) {
// 		hiLiteIndex === 0 ? hiLiteIndex = filteredCountries.length-1 : hiLiteIndex -= 1
// 	} else if (e.key === "Enter") {
// 		setInputVal(filteredCountries[hiLiteIndex]);
// 	} else {
// 		return;
// 	}
// } 

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
        <Title id="large-scroll-title">Add articles to your timeline</Title>
        <Content id="large-scroll-content">
            
            <div>

                <div style="margin-top:1em;">
                    <Textfield style="width: 75%;"
                        variant="outlined" 
                        id="search"
                        bind:value={searchTerm} 
                        label="Enter the title of an article"
                        on:keyup={() => articleLookup(searchTerm)}>
                    </Textfield>
                    <Button on:click={() => addNewEntry(searchTerm)} touch variant="raised" style="float:right">
                        <Label>Add</Label>
                    </Button>
                </div>
                {#if autoCompleteData.length > 0}
                <div style="width: 75%; display: contents; margin-top:0px;">
                    <ul id="autocomplete-items-list">
                        {#each autoCompleteData as page, i}
                            <Country itemLabel={page.title} highlighted={i === hiLiteIndex} on:click={() => setInputVal(page.title)} />
                            <!--<li class="autocomplete-items" class:autocomplete-active={highlighted} on:click>{@html itemLabel}</li>-->
                        {/each}			
                    </ul>
                </div>
                {/if}
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
   
    <Button on:click={() => (open = true)} touch variant="outlined" style="width:100%">
    <Label>Add more articles to search</Label>
    </Button>
    

    <style>
        ul {
            padding-left:0px;
            height: 200px;
            overflow-y: scroll;
            overflow-x: hidden;
            width: 70.5%;
            position: absolute;
            z-index: 99;
            margin-top: 0px;
        }


    </style>