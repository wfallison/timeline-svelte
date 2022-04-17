<script lang="ts">
    import { text } from 'svelte/internal';
    import { spring } from 'svelte/motion';
    import { articleResults, uniqueTitlesAndColors } from '../stores';
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


    let timeLineData = [];

    articleResults.subscribe(value => {
		timeLineData = value;
	});

    const resArray = Array.from(timeLineData)

    const articleTitles = resArray.map((el) => {
        return el.articleTitle
    })

    let uniqueTitles = [...new Set(articleTitles)]
    
    $uniqueTitlesAndColors = uniqueTitles.map((title, i) =>{
        return {
            title: title,
            color: shuffled[i]
        };
    })


    </script>

    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/svelte-material-ui@6.0.0/bare.min.css"
    />

    <div style="margin:auto;">
        <LayoutGrid>
            {#each uniqueTitles as title, i}
              <Cell>
                <div class="card-display">
                    <div class="card-container">
                        <Card padded>
                            <div style="display: inline-flex;">
                            <Icon class="material-icons" on style="color:#{shuffled[i]};    padding-top: 0.7em;
                            padding-right: 0.75em;">discount</Icon>
                            <h2>{title}</h2>
                            </div>
                        </Card>
                    </div>
                </div>
              </Cell>
            {/each}
          </LayoutGrid>
   
    </div>

    <style></style>