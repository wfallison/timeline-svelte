
<script lang="ts">
  import Dialog, { Title, Content, Actions } from '@smui/dialog';
  import Button, { Label } from '@smui/button';
  import Fab, { Icon } from '@smui/fab';
  import { fade } from 'svelte/transition';
  import { onMount } from 'svelte';
  import DataTable, {
    Head,
    Body,
    Row,
    Cell,
    Pagination,
  } from '@smui/data-table';
  import Select, { Option } from '@smui/select';
  import IconButton from '@smui/icon-button';
  import watcher from '../lib/watcher'
  import { articleResults, loading, searchCriteria, err } from '../stores';

  // import LoremIpsum from '$lib/LoremIpsum.svelte';

  const i = watcher(0, watchFunction)

  let open = false;
  let collections = [];
  let totalCount:number;

  async function watchFunction(a,b) {
		collections = await getCollections(10, $i);
	}
	
	async function inc() {
		$i++
    currentPage = $i;
	}

  async function dec() {
		$i--
    currentPage = $i;
	}

  async function firstPage() {
    $i = 0
    currentPage = 0
	}
  async function goTolastPage() {
    $i = lastPage
    currentPage = lastPage
	}

  async function selectCollectionItem(collectionItem){
    open = false;
    $loading = true;
    await fetch(`${process.env.API_URL}/api/w`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(collectionItem.collectionItems)
		}).then(async (data) => {
			const results = await data.json();
			$articleResults = results;
			$loading = false;
		}).catch((error) => {
       $err = true;
    });
  }

  type Collection = [
    {
      collectionName: String,
      collectionItems: Array<String>,
      countItems: Number
    }
  ]

  async function getCollections(rowsPerPage:number, currentPage:number) {

    let collectionsArr : Partial<Collection>;

		await fetch(`${process.env.API_URL}/api/collections?page=${currentPage}`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		}).then(async (data) => {
			const results = await data.json();
      totalCount = results.total;
			results.result.map((el: any) => {
				collectionsArr.push({
            collectionName: el.collectionName,
            collectionItems: el.collectionItems,
            countItems: el.collectionItems.length
            }
          )
			});
		}).catch((err) => {
       console.log(err)
    });
  
    return collectionsArr;
	}

  onMount(async () => {
    collections = await getCollections(rowsPerPage, currentPage);
	});

  let rowsPerPage = 10;
  let currentPage = $i;

  $: start = currentPage * rowsPerPage;
  $: end = Math.min(start + rowsPerPage, totalCount);
  $: slice = collections.slice(start, end);
  $: lastPage = Math.max(Math.ceil(totalCount / rowsPerPage) - 1, 0);
 
  $: if (currentPage > lastPage) {
    currentPage = lastPage;
  }

</script>
<div out:fade>
<Dialog
  bind:open
  aria-labelledby="large-scroll-title"
  aria-describedby="large-scroll-content"
  surface$style="width: 850px; max-width: calc(100vw - 32px);"
>
  <Content style="padding:0px;" id="large-scroll-content">
    <DataTable table$aria-label="Collection List" style="width: 100%;">
        <Head>
          <Row>
            <Cell>Name</Cell>
            <Cell numeric>Items</Cell>
          </Row>
        </Head>
        <Body>
        {#each collections as collectionItem}
        <Row on:click={selectCollectionItem(collectionItem)}>
          <Cell>{collectionItem.collectionName}</Cell>
          <Cell numeric>{collectionItem.countItems}</Cell>
        </Row>
        {/each}
      </Body>
      <Pagination slot="paginate">
        <svelte:fragment slot="rowsPerPage">
          <Label>Rows Per Page</Label>
          <Select disabled variant="outlined" bind:value={rowsPerPage} noLabel>
            <Option value={10}>10</Option>
            <!-- <Option value={25}>25</Option>
            <Option value={100}>100</Option> -->
          </Select>
        </svelte:fragment>
        <svelte:fragment slot="total">
          {start + 1}-{end} of {totalCount}
        </svelte:fragment>
     
        <IconButton
          class="material-icons"
          action="first-page"
          title="First page"
          on:click={firstPage}
          disabled={currentPage === 0}>first_page</IconButton
        >
        <IconButton
          class="material-icons"
          action="prev-page"
          title="Prev page"
          on:click={dec}
          disabled={currentPage === 0}>chevron_left</IconButton
        >
        <IconButton
          class="material-icons"
          action="next-page"
          title="Next page"
          on:click={inc}
          disabled={currentPage === lastPage}>chevron_right</IconButton
        >
        <IconButton
          class="material-icons"
          action="last-page"
          title="Last page"
          on:click={goTolastPage}
          disabled={currentPage === lastPage}>last_page</IconButton
        >
      </Pagination>
    </DataTable>
  </Content>
  <!-- <Actions>
    <Button action="accept">
      <Label>Done</Label>
    </Button>
  </Actions> -->
</Dialog>
</div>
<div class="flexy">
  <div class="margins">
    <Button on:click={() => (open = true)} mini>
      Collections
      <Icon style="padding-left:.5em;" class="material-icons">favorite</Icon>
    </Button>
  </div>
</div>

