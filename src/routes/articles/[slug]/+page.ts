// svelte
import { error } from '@sveltejs/kit';

// types
import type { PageLoad } from './$types';
import type Post from '$types/blog/Post';

// Get posts' info
const allPosts = import.meta.glob('$lib/posts/*.md', { eager: true });

const posts: Post[] = [];

// Get the posts' slugs
for (const path in allPosts) {
	const post = allPosts[path];
	const slug = post.metadata.slug;
	const p = { post, slug };
	posts.push(p);
}

export const load: PageLoad = ({ params }) => {
	const { slug } = params;

	// Find the post with the slug
	const filteredPost = posts.find((p) => {
		return p.slug.toLowerCase() === slug.toLowerCase();
	});

	if (!filteredPost) {
		throw error(500, 'Could not load post');
	}

	return {
		// Tell page to load that post's module
		page: filteredPost.post.default,
	};
};
