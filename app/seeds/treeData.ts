
export const treeData = [
    {
        id: '1',
        name: 'Dashboard',
        icon: 'bi-speedometer2',
        url: '/dashboard',
        expanded: false,
        level: 0,
        children: [],
    },
    {
        id: '2',
        name: 'Category',
        icon: 'bi-folder',
        expanded: true,
        level: 0,
        children: [
            {
                id: '2-1',
                name: 'Subcategory 1',
                icon: 'bi-folder',
                url: '/category/sub1',
                expanded: false,
                level: 1,
                children: [],
            },
            {
                id: '2-2',
                name: 'Subcategory 2',
                icon: 'bi-folder',
                url: '/category/sub2',
                expanded: true,
                level: 1,
                children: [
                    {
                        id: '2-2-1',
                        name: 'Sub-subcategory',
                        icon: 'bi-file',
                        url: '/category/sub2/sub-sub1',
                        expanded: false,
                        level: 2,
                        children: [],
                    },
                ],
            },
        ],
    },
];