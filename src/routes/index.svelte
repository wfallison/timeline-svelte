<script lang="ts">

	import { articleResults, loading, uniqueTitlesAndColors } from '../stores';
	import LinearProgress from '@smui/linear-progress';

	import SearchMultiple from '../components/SearchMultiple.svelte'
	import SearchResultHeader from "../components/SearchResultHeader.svelte";
	import Chip, { Set, LeadingIcon, Text } from '@smui/chips';

	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from 'svelte-vertical-timeline';

	let timeLineData = {};
	let titlesAndColorsData;
	let isLoading = false;

	articleResults.subscribe(value => {
		timeLineData = value;
	});

	loading.subscribe(value => {
		isLoading = value;
	});

	uniqueTitlesAndColors.subscribe(value => {
		titlesAndColorsData = value;
	})

	function getColorByTitle(title){ //element.title == title
		console.log(titlesAndColorsData)
		const found = titlesAndColorsData.find(element => element.title == title || element.searchedValue == title);
		console.log(found)
		return found.color ? found.color: "CACF85"
	}

	console.log(timeLineData)

	const truncate = (input) => input.length > 10 ? `${input.substring(0, 10)}...` : input;
	
</script>


	{#if isLoading == true}
		<LinearProgress indeterminate/>
	{/if}

	{#if timeLineData && isLoading == false}
	<SearchResultHeader></SearchResultHeader>
	<Timeline position="alternate" style={"margin: auto; width: 90%;}"}>
		{#each timeLineData.sorted as option}
			<TimelineItem>
				<TimelineOppositeContent slot="opposite-content" style="font-size:16px;">
					<div>
					<h3 style="font-size:20px">{option.stringDate}</h3>
					<Chip chip={{}}touch style="margin-top: 10px;">
						<LeadingIcon class="material-icons" style="color:#{getColorByTitle(option.articleTitle)};">discount</LeadingIcon>
						<Text>{option.articleTitle ? option.articleTitle : option.searchValue}</Text>
						</Chip>
						<Chip chip={{}}touch style="margin-top: 10px;">
						<LeadingIcon class="material-icons">event</LeadingIcon>
						<Text>{option.stringDate}</Text>
						</Chip>
						{#if option.meta.sectionTitle}
						<Chip chip={{}}touch style="max-width: 250px; margin-top: 10px;
						overflow: hidden;">
						<LeadingIcon class="material-icons">category</LeadingIcon>
						<Text>{truncate(option.meta.sectionTitle)}</Text>
						</Chip>
						{/if}
					</div>
				</TimelineOppositeContent>
				<TimelineSeparator>
					<TimelineDot style="background-color: #{getColorByTitle(option.articleTitle)}"/>
					<TimelineConnector />
				</TimelineSeparator>
				<TimelineContent>
					<h3>{option.sentence}</h3>
						<span>
						<!-- <Set chips={option} let:chip filter bind:selected> -->
							
						<!-- </Set> -->
					</span>
				</TimelineContent>
			</TimelineItem>
		{/each}
	</Timeline>
	{/if}

<style>
	.grayed {
		opacity: 0.6;
	}

</style>
