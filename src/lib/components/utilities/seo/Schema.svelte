<script lang="ts">
	// packages
	import hash from 'object-hash';

	// * required props *
	export let author: string;
	export let createdAt: string;
	export let entity;
	export let updatedAt: string;
	export let featuredImage;
	export let metaDescription: string;
	export let siteLanguage: string;
	// export let siteTitle: string;
	// export let siteTitleAlt: string;
	export let siteUrl: string;
	export let title: string;
	export let url: string;
	export let github: string;

	// optional props
	export let breadcrumbs: { name: string; slug: string }[];
	export let entityMeta: { url: string; faviconWidth: number; faviconHeight: number } | null = null;
	export let isMarkdownItem = false;
	export let itemType: string = 'article';

	const entityHash = hash({ author }, { algorithm: 'md5' });

	const schemaOrgEntity =
		entityMeta !== null
			? {
					'@type': ['Person', 'Organization'],
					'@id': `${siteUrl}/#/schema/person/${entityHash}`,
					name: author,
					image: {
						'@type': 'ImageObject',
						'@id': `${siteUrl}/#personlogo`,
						inLanguage: siteLanguage,
						url: entityMeta.url,
						width: entityMeta.faviconWidth,
						height: entityMeta.faviconHeight,
						caption: author,
					},
					logo: {
						'@id': `${siteUrl}/#personlogo`,
					},
					sameAs: [github],
			  }
			: null;

	// ! important !: uncomment if using search on the site
	// const schemaOrgWebsite = {
	// 	'@type': 'WebSite',
	// 	'@id': `${siteUrl}/#website`,
	// 	url: siteUrl,
	// 	name: siteTitle,
	// 	description: siteTitleAlt,
	// 	publisher: {
	// 		'@id': `${siteUrl}/#/schema/person/${entityHash}`,
	// 	},
	// 	potentialAction: [
	// 		{
	// 			'@type': 'SearchAction',
	// 			target: `${siteUrl}/?s={search_term_string}`,
	// 			'query-input': 'required name=search_term_string',
	// 		},
	// 	],
	// 	inLanguage: siteLanguage,
	// };

	const schemaOrgImageObject = {
		'@type': 'ImageObject',
		'@id': `${url}#primaryimage`,
		inLanguage: siteLanguage,
		url: featuredImage.url,
		contentUrl: featuredImage.url,
		width: featuredImage.width,
		height: featuredImage.height,
		caption: featuredImage.caption,
	};

	const schemaOrgBreadcrumbList = {
		'@type': 'BreadcrumbList',
		'@id': `${url}#breadcrumb`,
		itemListElement: breadcrumbs.map((element, index) => ({
			'@type': 'ListItem',
			position: index + 1,
			item: {
				'@type': 'WebPage',
				'@id': `${siteUrl}/${element.slug}`,
				url: `${siteUrl}/${element.slug}`,
				name: element.name,
			},
		})),
	};

	const schemaOrgWebPage = {
		'@type': 'WebPage',
		'@id': `${url}#webpage`,
		url,
		name: title,
		isPartOf: {
			'@id': `${siteUrl}/#website`,
		},
		primaryImageOfPage: {
			'@id': `${url}#primaryimage`,
		},
		datePublished: createdAt,
		dateModified: updatedAt,
		author: {
			'@id': `${siteUrl}/#/schema/person/${entityHash}`,
		},
		description: metaDescription,
		breadcrumb: {
			'@id': `${url}#breadcrumb`,
		},
		inLanguage: siteLanguage,
		potentialAction: [
			{
				'@type': 'ReadAction',
				target: [url],
			},
		],
	};

	let schemaOrgArticle = null;

	if (isMarkdownItem) {
		schemaOrgArticle = {
			'@type': 'Article',
			'@id': `${url}#article`,
			isPartOf: {
				'@id': `${url}#webpage`,
			},
			author: {
				'@id': `${siteUrl}/#/schema/person/${entityHash}`,
			},
			headline: title,
			datePublished: createdAt,
			dateModified: updatedAt,
			mainEntityOfPage: {
				'@id': `${url}#webpage`,
			},
			publisher: {
				'@id': `${siteUrl}/#/schema/person/${entityHash}`,
			},
			image: {
				'@id': `${url}#primaryimage`,
			},
			articleSection: [itemType],
			inLanguage: siteLanguage,
		};
	}

	const schemaOrgPublisher = {
		'@type': ['Person', 'Organization'],
		'@id': `${siteUrl}/#/schema/person/${entityHash}`,
		name: entity,
		image: {
			'@type': 'ImageObject',
			'@id': `${siteUrl}/#personlogo`,
			inLanguage: siteLanguage,
			url: `${siteUrl}/favicon/android-chrome-512x512.png`,
			contentUrl: `${siteUrl}/favicon/android-chrome-512x512.png`,
			width: 512,
			height: 512,
			caption: entity,
		},
		logo: {
			'@id': `${siteUrl}/#personlogo`,
		},
		sameAs: [github],
	};

	// create an array of included schema items
	const schemaOrgArray = [
		schemaOrgEntity,
		// ! important !: uncomment if using search on the site
		// schemaOrgWebsite,
		schemaOrgImageObject,
		schemaOrgWebPage,
		schemaOrgBreadcrumbList,
		...(isMarkdownItem ? [schemaOrgArticle] : []),
		schemaOrgPublisher,
	];

	// create the schema object from included items
	const schemaOrgObject = {
		'@context': 'https://schema.org',
		'@graph': schemaOrgArray,
	};

	// stringify output
	const jsonLdString = JSON.stringify(schemaOrgObject);

	// insert jsonLD script in the head
	let jsonLdScript = `
		<script type="application/ld+json">
			${jsonLdString}
		${'<'}/script>
	`;
</script>

<svelte:head>
	{@html jsonLdScript}
</svelte:head>
