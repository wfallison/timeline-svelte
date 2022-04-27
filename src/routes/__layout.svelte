<script lang="ts">
	import Button from '@smui/button';
	import type { TopAppBarComponentDev } from '@smui/top-app-bar';
	import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
	import IconButton from '@smui/icon-button';
	import { Label, Icon } from '@smui/common';
	import { Svg } from '@smui/common/elements';
	import { mdiGithub, mdiWeb, mdiLightbulbVariantOutline  } from '@mdi/js';

	import Search from '../components/Search.svelte';
	import SearchMultiple from '../components/SearchMultiple.svelte'



	let topAppBar: TopAppBarComponentDev;

	let lightTheme =
		typeof window === 'undefined' || window.matchMedia('(prefers-color-scheme: light)').matches;
	function switchTheme() {
		lightTheme = !lightTheme;
		let themeLink = document.head.querySelector<HTMLLinkElement>('#theme');
		if (!themeLink) {
			themeLink = document.createElement('link');
			themeLink.rel = 'stylesheet';
			themeLink.id = 'theme';
		}
		themeLink.href = `/smui${lightTheme ? '' : '-dark'}.css`;
		document.head
			.querySelector<HTMLLinkElement>('link[href$="/smui-dark.css"]')
			?.insertAdjacentElement('afterend', themeLink);
	}
</script>

<TopAppBar bind:this={topAppBar} variant="standard">
	<Row>
		<Section>
			<Title>WTL</Title>
		</Section>
		<Section id="searchMultiple">
			<SearchMultiple></SearchMultiple>
		</Section>
		<Section align="end" toolbar>
			<IconButton 
				aria-label="Toggle between light and dark mode" 
				on:click={switchTheme}>
				<Icon component={Svg} viewBox="0 0 24 24">
					<path fill="currentColor" d={mdiLightbulbVariantOutline } />
				</Icon>
			</IconButton>

		</Section>
	</Row>
</TopAppBar>

<AutoAdjust {topAppBar} style="display: flex; justify-content: space-between;">
	<div class="container"><slot /></div>
	<!-- <div class="container">
		<Button on:click={switchTheme}>
			<Label>{lightTheme ? 'Lights off' : 'Lights on'}</Label>
		</Button>
	</div> -->
</AutoAdjust>
