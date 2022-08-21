<script lang="ts">

    import { page } from '$app/stores';
	import { articleResults, loading, searchCriteria } from '../stores';

    import { fade } from 'svelte/transition';

    /* SMUI Components (Can this be condensed?) */
    import Autocomplete from '@smui-extra/autocomplete';
	import Button, { Group, Label } from '@smui/button';
    import CircularProgress from '@smui/circular-progress';
    import Dialog, { Title, Content, Actions } from '@smui/dialog';
    import Fab, { Icon } from '@smui/fab';
    import { Text } from '@smui/list';
	import Textfield from '@smui/textfield';

    /* 
    Control for dialog opened/closed
    Accessible where this component is imported
    */  
	export let open = false;

    const randomSearch = () => {

        let randomSearchVars;
        randomSearchVars = [
            {"articleTitle": "Pangaea"},
            {"articleTitle": "Human"},
            {"articleTitle": "Agriculture"},
            {"articleTitle": "Horseshoe crab"},
            {"articleTitle": "Rodinia"},
            {"articleTitle": "Columbia (supercontinent)"},
            {"articleTitle": "Tool"},
            {"articleTitle": "Rome"},
            {"articleTitle": "Ancient Egypt"}
        ]

        makeRequestWithVars(randomSearchVars)
    }

    const makeRequestWithVars = async function (randomSearchVars) {
		let urlPrams = $page.url.search;
		console.log(urlPrams);
		$loading = true;
		open = false;

		fetch(`${process.env.API_URL}/api/w`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(randomSearchVars)
		}).then(async (data) => {
			const results = await data.json();
			$articleResults = results;
			$loading = false;
		});
	};
</script>

{#if open}
	<div in:spin={{ duration: 8000 }} out:fade>
		<Dialog
			bind:open
			aria-labelledby="mandatory-title"
			aria-describedby="madanatory-content"
			surface$style="width: 850px; max-width: calc(100vw - 32px);"
			class="secondary"
			on:click={() => (autoCompleteData = [])}
		>
			<Content id="mandatory-content">
				<div>
                    <h1>Thanks for visiting!</h1>
                    <p> This is a tool that parses data from Wikipedia articles to create visual timelines for you.
                        You can search for one, or many articles. All of the events in the articles you search for
                        will be combined into a single scrollable timeline.
                    </p>
                    <p>
                        <b>Click the search button below</b>, or try the Demo
                    </p>
                    <Button on:click={() => randomSearch()} touch variant="raised" style="float:left">
                        <Label>Try the demo!</Label>
                    </Button>
                    
				<Button
                on:click={() => (open = false)}
                touch
                variant="raised"
                style="float:right; margin-right:5px;"
                >
                    <Label>Start Search</Label>
                </Button>
			</div>
			</Content>

		</Dialog>
	</div>
{/if}

<style></style>
