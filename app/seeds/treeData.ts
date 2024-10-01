
export const treeData = [
    {
        id: '1',
        name: 'Dashboard',
        icon: 'bi-speedometer2',
        url: '/',
        expanded: false,
        level: 0,
        children: [],
    },
    {
        id: '2',
        name: 'Category',
        icon: 'bi-folder',
        expanded: false,
        level: 0,
        children: [
            {
                id: '2-1',
                name: 'Subcategory 1',
                icon: 'bi-folder',
                url: '/',
                expanded: false,
                level: 1,
                children: [],
            },
            {
                id: '2-2',
                name: 'Subcategory 2',
                icon: 'bi-folder',
                url: '/',
                expanded: false,
                level: 1,
                children: [
                    {
                        id: '2-2-1',
                        name: 'Sub-subcategory',
                        icon: 'bi-file',
                        url: '/',
                        expanded: false,
                        level: 2,
                        children: [
                            {
                                id: '2-2-1-1',
                                name: 'fdjafjdaklfjdas',
                                icon: 'bi-file',
                                url: '/',
                                expanded: false,
                                level: 3,
                                children: [],
                            }
                        ],
                    },
                ],
            },
        ],

    },
    {
        id: '3',
        name: 'Region',
        icon: 'bi-folder',
        expanded: false,
        level: 0,
        children: [
            {
                id: '2-1',
                name: 'Subcategory 1',
                icon: 'bi-folder',
                url: '/',
                expanded: false,
                level: 1,
                children: [],
            },
            {
                id: '3-2',
                name: 'Subcategory 2',
                icon: 'bi-folder',
                url: '/',
                expanded: false,
                level: 1,
                children: [
                    {
                        id: '3-2-1',
                        name: 'Sub-subcategory',
                        icon: 'bi-file',
                        url: '/',
                        expanded: false,
                        level: 2,
                        children: [
                            {
                                id: '3-2-1-1',
                                name: 'fdjafjdaklfjdas',
                                icon: 'bi-file',
                                url: '/',
                                expanded: false,
                                level: 3,
                                children: [],
                            }
                        ],
                    },
                ],
            },
        ],

    },
];