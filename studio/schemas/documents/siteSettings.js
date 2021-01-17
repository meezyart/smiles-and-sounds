export default {
    name: 'siteSettings',
    type: 'document',
    title: 'Site Settings',
    fieldsets: [
        { name: 'google', title: 'Google' },
        { name: 'meta', title: 'Meta Settings' },
        { name: 'feed', title: 'Feed Settings' },
    ],
    __experimental_actions: ['update', /* 'create', 'delete', */ 'publish'],
    fields: [{
            name: 'title',
            type: 'string',
            title: 'Title'
        },
        {
            name: 'description',
            type: 'text',
            title: 'Description',
            description: 'Describe your blog for search engines and social media.'
        },
        {
            name: 'url',
            type: 'string',
            title: 'Site url',
            description: 'Site URL exp: https://update-me.com'
        },
        {
            name: 'domain',
            type: 'string',
            title: 'Domain',
            description: 'Site Domain exp: update-me.com'
        },
        {
            name: 'googleAnalyticsId',
            type: 'string',
            title: 'Google Analytics Id',
        },
        {
            name: 'lang',
            type: 'string',
            title: 'Site Language',
            fieldset: 'meta',
            description: 'Example: en'
        },
        {
            name: 'locale',
            type: 'string',
            title: 'Site Locale',
            fieldset: 'meta',
            description: 'Example: en_us'
        },
        {
            name: 'filename',
            type: 'string',
            title: 'Feed Filename',
            fieldset: 'feed',
            description: 'Default: feed.xml'
        },
        {
            name: 'path',
            type: 'string',
            title: 'Feed Path',
            fieldset: 'feed',
            description: 'Default: /feed/feed.xml'
        },
        {
            name: 'keywords',
            type: 'array',
            title: 'Keywords',
            description: 'Add keywords that describes your blog.',
            of: [{ type: 'string' }],
            options: {
                layout: 'tags'
            }
        },
        {
            name: 'author',
            type: 'reference',
            description: 'Publish an author and set a reference to them here.',
            title: 'Author',
            to: [{ type: 'author' }]
        }
    ]
}
