<script lang="ts">
	import { articleResults, uniqueTitlesAndColors, searchCriteria } from '../stores';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Card from '@smui/card';
	import Icon from '@smui/icon-button';

	const colors = [
		'29335C',
		'21A179',
		'FFCF00',
		'EE6123',
		'FA003F',
		'3F84E5',
		'4ECDC4',
		'C2E812',
		'DB2B39',
		'29335C',
		'EDF4ED',
		'FB9F89',
		'00916E'
	];

	let shuffled = colors
		.map((value) => ({ value, sort: Math.random() }))
		.sort((a, b) => a.sort - b.sort)
		.map(({ value }) => value);

	let timeLineData: number | Iterable<any> | ArrayLike<any> = [];
	let searchItems: number | Iterable<any> | ArrayLike<any> = [];
	let headerData: number | any[] = [];

	articleResults.subscribe((value) => {
		timeLineData = value;
	});

	searchCriteria.subscribe((value) => {
		searchItems = value;
	});

	uniqueTitlesAndColors.subscribe((value) => {
		headerData = value;
	});

	const articleTitles = timeLineData.headers.map((el) => {
		return {
			articleTitle: el.header.foundArticleTitle,
			searchedValue: el.header.searchedValue,
			countRecords: el.header.countRecords
		};
	});

	$uniqueTitlesAndColors = articleTitles.map((item, i) => {
		return {
			title: item.articleTitle,
			searchedValue: item.searchedValue,
			color: shuffled[i],
			count: item.countRecords,
			pageId: item.pageId
		};
	});
</script>

<div style="margin:auto;">
	<LayoutGrid>
		{#each headerData as title, i}
			<Cell>
				<div class="card-display">
					<div class="card-container">
						<Card padded>
							<div style="display: inline-flex;">
								<Icon
									class="material-icons"
									on
									style="color:#{title.color}; padding-top: 0.7em; padding-right: 0.75em;"
								>
									discount
								</Icon>
								<div style="width:60%; padding-right:5%">
									<h2 style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
										{title.title ? title.title : title.searchedValue}
									</h2>
								</div>
								<div style="text-align: end; width: 35%; margin-right:25px;">
									{title.count} results
								</div>
							</div>
						</Card>
					</div>
				</div>
			</Cell>
		{/each}
	</LayoutGrid>
</div>

<style></style>
