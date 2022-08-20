<script lang="ts">
    import { text } from 'svelte/internal';
    import { spring } from 'svelte/motion';
    import { articleResults, uniqueTitlesAndColors, searchCriteria } from '../stores';
    import Button, { Group, Label } from '@smui/button';
    import Textfield from '@smui/textfield';

    import LayoutGrid, { Cell } from '@smui/layout-grid';
    import Card, {
    Content,
    PrimaryAction,
    Actions,
    ActionButtons,
    ActionIcons,
  } from '@smui/card';

  import IconButton, { Icon } from '@smui/icon-button';

    const colors = [
        '29335C', '21A179', 'FFCF00', 'EE6123', 'FA003F', '3F84E5', '4ECDC4',
        'C2E812', 'DB2B39', '29335C', 'EDF4ED', 'FB9F89', '00916E'
    ]

    let shuffled = colors
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value)


    let timeLineData: number|Iterable<any>|ArrayLike<any> = [];
    let searchItems: number|Iterable<any>|ArrayLike<any> = [];
    let headerData: number|any[] = []

    articleResults.subscribe(value => {
		  timeLineData = value;
	  });

    searchCriteria.subscribe(value => {
		  searchItems = value;
	  });

    uniqueTitlesAndColors.subscribe(value => {
		  headerData = value;
	  });

    const articleTitles = timeLineData.headers.map((el) => {
          return {
              articleTitle: el.header.foundArticleTitle,
              searchedValue: el.header.searchedValue,
              countRecords: el.header.countRecords,
          }
    })


    $uniqueTitlesAndColors = articleTitles.map((item, i) =>{
      console.log(item)
        return {
            title: item.articleTitle,
            searchedValue: item.searchedValue,
            color: shuffled[i],
            count: item.countRecords,
            pageId:item .pageId
        };
    });

    //remove header
    //timeLineData.pop();

    </script>


    <div style="margin:auto;">
        <LayoutGrid>
            {#each headerData as title, i}
              <Cell>
                <div class="card-display">
                    <div class="card-container">
                        <Card padded>
                            <div style="display: inline-flex;">
                            <Icon class="material-icons" on style="color:#{title.color}; padding-top: 0.7em;
                            padding-right: 0.75em;">discount</Icon>
                            <div style="width:65%">
                              <h2>{title.title ?  title.title : title.searchedValue}</h2>
                            </div>
                            <div style="text-align: end;width: 25%%;">{title.count} results</div>
                            </div>
                        </Card>
                    </div>
                </div>
              </Cell>
            {/each}
          </LayoutGrid>
   
    </div>

    <style></style>