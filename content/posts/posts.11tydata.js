export default {
	tags: [
		"posts"
	],
	"layout": "layouts/post.njk",
  "permalink": "/{{ slug if slug else title | slugify }}/"
};