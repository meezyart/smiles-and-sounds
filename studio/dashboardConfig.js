export default {
    widgets: [
        { name: 'structure-menu' },
        {
            name: 'project-info',
            options: {
                __experimental_before: [{
                    name: 'netlify',
                    options: {
                        description: 'NOTE: Because these sites are static builds, they need to be re-deployed to see the changes when documents are published.',
                        sites: [{
                                buildHookId: '5ffc9ea97ab84f0d2dc6f474',
                                title: 'Sanity Studio',
                                name: 'smiles-and-sounds-studio',
                                apiId: 'd071c0e9-9701-47fc-b97f-9159559b30fc'
                            },
                            {
                                buildHookId: '5ffc9ea93fbaad0a943b5b6d',
                                title: 'Blog Website',
                                name: 'smiles-and-sounds',
                                apiId: 'fee68a15-ce20-48b0-b1dd-112bd8a5637e'
                            }
                        ]
                    }
                }],
                data: [{
                        title: 'GitHub repo',
                        value: 'https://github.com/meezyart/smiles-and-sounds',
                        category: 'Code'
                    },
                    { title: 'Frontend', value: 'https://smiles-and-sounds.netlify.app', category: 'apps' }
                ]
            }
        },
        { name: 'project-users', layout: { height: 'auto' } },
        {
            name: 'document-list',
            options: { title: 'Recent blog posts', order: '_createdAt desc', types: ['post'] },
            layout: { width: 'medium' }
        }
    ]
}
