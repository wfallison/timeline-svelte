<script lang="ts">
	import { articleResults, loading, uniqueTitlesAndColors, err, errMsg } from '../stores';
	import LinearProgress from '@smui/linear-progress';

	import SearchResultHeader from '../components/SearchResultHeader.svelte';
	import Chip, { LeadingIcon, Text } from '@smui/chips';

  import ErrorDialog from '../components/ErrorDialog.svelte'
	import SearchMultiple from '../components/SearchMultiple.svelte'

	import {
		Timeline,
		TimelineItem,
		TimelineSeparator,
		TimelineDot,
		TimelineConnector,
		TimelineContent,
		TimelineOppositeContent
	} from 'svelte-vertical-timeline';

	let timeLineData: object = {};
	let titlesAndColorsData: Array<string>;
	let isLoading: boolean = false;
  let hasErrors: boolean = false;
  let errorMessage: any;

	articleResults.subscribe((value) => {
		timeLineData = value;
	});

	loading.subscribe((value) => {
		isLoading = value;
	});

	err.subscribe((value) => {
		hasErrors = value;
	});

  errMsg.subscribe((value) => {
    errorMessage = value;
  });

	uniqueTitlesAndColors.subscribe((value) => {
		titlesAndColorsData = value;
	});

	function getColorByTitle(title:string) {
		const found:Array<string> = titlesAndColorsData.find(
			(element) => element.title == title || element.searchedValue == title
			
		);
		return found.color ? found.color : 'CACF85';
	}

	const truncate = (input:string) => (input.length > 10 ? `${input.substring(0, 10)}...` : input);
</script>

{#if isLoading == true && hasErrors == false}
	<LinearProgress indeterminate />
{/if}

{#if hasErrors == true}
  <ErrorDialog errMessage=errorMessage></ErrorDialog>
{/if}

{#if timeLineData && isLoading == false}
	<SearchResultHeader />
	<Timeline position="alternate" style={'margin: auto; width: 90%;}'}>
		{#each timeLineData.sorted as option}
				<TimelineItem>
					<TimelineOppositeContent slot="opposite-content" style="font-size:16px; width: 20px">
						<div>
							<h3 style="font-size:20px; margin-bottom: 0px;">{option.stringDate || 'Invalid Option'}</h3>
							<Chip chip="{{}}touch" style="margin-top: 10px;">
								<LeadingIcon
									class="material-icons"
									style="color:#{getColorByTitle(option.articleTitle)  || 'Invalid Option'};">discount</LeadingIcon
								>
								<Text
									>{option.articleTitle
										? option.articleTitle
										: option.searchValue  || 'Invalid Option'}</Text
								>
							</Chip>
							<Chip chip="{{}}touch" style="margin-top: 10px;">
								<LeadingIcon class="material-icons">event</LeadingIcon>
								<Text>{option.stringDate  || 'Invalid Option'}</Text>
							</Chip>
							{#if option.meta.sectionTitle}
								<Chip
									chip="{{}}touch"
									style="max-width: 90%; margin-top: 10px;"
								>
									<LeadingIcon class="material-icons">category</LeadingIcon>
									<Text>{option.meta.sectionTitle  || 'Invalid Option'}</Text>
								</Chip>
							{/if}
						</div>
					</TimelineOppositeContent>
					<TimelineSeparator>
						<TimelineDot style="background-color: #{getColorByTitle(option.articleTitle  || 'Invalid Option')}" />
						<TimelineConnector style="background-color: #{getColorByTitle(option.articleTitle  || 'Invalid Option')}"/>
					</TimelineSeparator>
					<TimelineContent style="width: 45%">
						<h3 class = "timelineContent" style="margin-bottom:0px; margin-top: 1.5em; word-break: break-all;">{option.sentence  || 'Invalid Option'}</h3>
					</TimelineContent>
				</TimelineItem>
		{/each}
	</Timeline>
{/if}
<SearchMultiple></SearchMultiple>
<style>
</style>
