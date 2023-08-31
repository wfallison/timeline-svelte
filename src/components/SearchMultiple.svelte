<script lang="ts">
	import { page } from '$app/stores';
	import { articleResults, loading, searchCriteria, err, errMsg } from '../stores';
  import { goto } from "$app/navigation";
	import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';

	/* SMUI Components (Can this be condensed?) */
	import Autocomplete from '@smui-extra/autocomplete';
	import Button, { Group, Label } from '@smui/button';
	import CircularProgress from '@smui/circular-progress';
	import Dialog, { Title, Content, Actions } from '@smui/dialog';
	import Fab, { Icon } from '@smui/fab';
	import { Text } from '@smui/list';
	import Textfield from '@smui/textfield';
	import Search from './Search.svelte';

  import ErrorsDialog from './ErrorDialog.svelte'
  

	/* 
    Control for dialog opened/closed
    Accessible where this component is imported
    */
	export let open = false;

	$: searchTerm = '';
	$: searchArray = [];
	$: autoCompleteData = [];

	/* 
    let value: string;
    The search string pretty much
    needs a new name..
    */

	let value: string;

	const removeEntry = function (itemIndex: number) {
		searchArray.splice(itemIndex, 1);
		searchArray = searchArray;
	};

	const addNewEntry = function (searchParam: string) {
		if (searchParam) {
			searchArray.push({
				articleTitle: searchParam
			});
			searchArray = searchArray;
			searchTerm = '';
		}
	};

	const removeAllEntries = function () {
    console.log(searchArray)
		searchArray = [];
		searchArray = searchArray;
	};

	export const makeRequest = async function () {
		
		$loading = true;
		open = false;

		value = '';
		autoCompleteData = [];

		$searchCriteria = searchArray;

    let query = new URLSearchParams();
    let searchURL;

    for (const article of searchArray){
      query.append('articleTitle', btoa(article.articleTitle));
    }
        
    goto(`?${query.toString()}`,
      {
        keepfocus: true
      }
    );

		await fetch(`${process.env.API_URL}/api/w`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(searchArray)
		}).then(async (data) => {
			const results = await data.json();
      console.log('results', results)
			$articleResults = results;
			$loading = false;
		}).catch((error) => {
       console.log('error', error)
       $err = true;
       $errMsg = error;
    });
	};
  
	let counter = 0;
	async function searchItems(input: string) {
		if (input === '') {
			return false;
		}
		const myCounter = ++counter;
		await new Promise((resolve) => setTimeout(resolve, 1000));

		if (myCounter !== counter) {
      // This means the function was called again, so we should cancel.
      // This is how you tell Autocomplete to cancel this search. It won't
      // replace the results of any subsequent search that has already finished.
			// This is from the manual. Its a little clunky feeling but better than before
      return false;
    }

		let autoCompleteData_Arr;

		await fetch(`${process.env.API_URL}/api/lookup?searchTerm=${input}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(async (data) => {
			const results = await data.json();
			const pages = results.query.allpages;
			autoCompleteData_Arr = pages.map((el: any) => {
				return el.title;
			});
		}).catch((err) => {
       console.log(err)
    });

		return autoCompleteData_Arr;
	}
  
  function getJsonFromUrl(url) {
    if(!url) url = location.search;
    url.split("&").forEach(function(part) {
      var item = part.split("=");
      addNewEntry(atob(item[1].replace(/%3D/g, '')));
    });
  }

  onMount(async () => {
    let urlParams = $page.url.search;
		getJsonFromUrl(urlParams)
    if (searchArray){
      makeRequest();
    }
	});


</script>

<!-- <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
/> -->

{#if open}
	<div out:fade>
		<Dialog
			bind:open
			aria-labelledby="large-scroll-title"
			aria-describedby="large-scroll-content"
			surface$style="width: 850px; max-width: calc(100vw - 32px);"
			class="secondary"
			on:click={() => (autoCompleteData = [])}
		>
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
						<Button
							on:click={() => addNewEntry(value)}
							touch
							variant="raised"
							style="float:right; margin-top: 1em;"
						>
							<Label>Add</Label>
						</Button>
					</div>
				</div>
				<div style="margin-top:5em; height:25em;">
					{#each searchArray as entry, i}
						<div style="margin-top:2em;">
							<Textfield
								style="width: 75%;"
								variant="outlined"
								bind:value={entry.articleTitle}
								label="Search Term"
							/>

							<Button
								on:click={() => removeEntry(i)}
								touch
								variant="raised"
								style="width: 20%; float:right;"
							>
								<Label>Remove</Label>
							</Button>
						</div>
					{/each}
				</div>
			</Content>
			<div style="margin:2em">
				<Button on:click={() => removeAllEntries()} touch variant="raised" style="float:left">
					<Label>Clear All</Label>
				</Button>

				<Button on:click={makeRequest} touch variant="raised" style="float:right">
					<Label>Search</Label>
				</Button>
				<Button
					on:click={() => (open = false)}
					touch
					variant="raised"
					style="float:right; margin-right:5px;"
				>
					<Label>Close</Label>
				</Button>
			</div>
		</Dialog>
	</div>
{/if}

<div class="flexy" style="bottom: 2em; position: fixed; right: 2em;">
	<div class="margins">
		<Fab style="width:5em;height:5em;" on:click={() => (open = true)}>
			<Icon style="font-size:2.5em" class="material-icons">manage_search</Icon>
		</Fab>
	</div>
</div>

<style></style>
