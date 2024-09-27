import React, { useState } from 'react';
import { TreeNode } from '../../types/treeMenu';  // Import TreeNode from 'types/treeMenu.ts'
import styles from '../../styles/trees/treeView.module.css';  // Import styles from 'treeView.module.css'
import { useRouter } from 'next/navigation';  // Import useRouter for navigation

interface TreeViewProps {
    nodes: TreeNode[];
}

const TreeView: React.FC<TreeViewProps> = ({ nodes }) => {
    const [treeData, setTreeData] = useState<TreeNode[]>(nodes);
    const [showMenu, setShowMenu] = useState<string | null>(null);
    // const [dialogInfo, setDialogInfo] = useState<{ nodeId: string; type: 'sibling' | 'child' } | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [currentNode, setCurrentNode] = useState<TreeNode | null>(null);
    const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; nodeId: string | null }>({
        visible: false,
        x: 0,
        y: 0,
        nodeId: null,
    });

    const router = useRouter();

    const toggleNode = (id: string, nodeList: TreeNode[]): TreeNode[] => {
        return nodeList.map(node => {
            if (node.id === id) {
                return { ...node, expanded: !node.expanded };
            } else if (node.children) {
                return { ...node, children: toggleNode(id, node.children) };
            }
            return node;
        });
    };

    const handleToggle = (id: string) => {
        const updatedTree = toggleNode(id, treeData);
        setTreeData(updatedTree);
    };

    const handleNodeClick = (url: string | undefined) => {
        if (url) {
            router.push(url);
        }
    };

    // const handleMenuClick = (nodeId: string, type: 'sibling' | 'child') => {
    //     setDialogInfo({ nodeId, type });
    //     setShowMenu(null);  // Close the menu after click
    // };

    const handleContextMenu = (event: React.MouseEvent, nodeId: string | null) => {
        event.preventDefault();
        setContextMenu({
            visible: true,
            x: event.pageX,
            y: event.pageY,
            nodeId,
        });

    };

    const closeContextMenu = () => {
        setContextMenu({ visible: false, x: 0, y: 0, nodeId: null });
    };

    const openDialog = (node: TreeNode) => {
        setCurrentNode(node);
        setShowDialog(true);
        closeContextMenu();
    };

    // const handleAddNode = (name: string, nodeId: string, type: 'sibling' | 'child') => {
    //     const updatedTree = addNode(treeData, nodeId, type, { id: Date.now().toString(), name, icon: 'bi-file', expanded: false, level: 0, children: [] });
    //     setTreeData(updatedTree);
    //     setDialogInfo(null);  // Close the dialog
    // };

    // const addNode = (nodes: TreeNode[], nodeId: string, type: 'sibling' | 'child', newNode: TreeNode): TreeNode[] => {
    //     return nodes.map(node => {
    //         if (node.id === nodeId && type === 'child') {
    //             return { ...node, children: [...(node.children || []), newNode], expanded: true };
    //         } else if (node.children) {
    //             return { ...node, children: addNode(node.children, nodeId, type, newNode) };
    //         }
    //         return node;
    //     });
    // };

    const addNode = (newNode: Omit<TreeNode, 'id'>) => {
        // Logic to add node to source data
        setTreeData(prevState => [
            ...prevState,
            {
                ...newNode,
                id: Math.random().toString(), // Generate a random ID or use a better approach
            },
        ]);
        setShowDialog(false); // Close the dialog
    };

    const handleCancel = () => {
        setShowDialog(false); // Close the dialog
    }

    const renderTreeNodes = (nodeList: TreeNode[], level = 0) => {
        return (
            <ul className={`list-unstyled ${styles.nodeList} ${styles[`level-${level}`]}`}>
                {nodeList.map(node => (
                    <li key={node.id} className={styles.nodeWrapper}>
                        <div className={`d-flex align-items-center justify-content-between ${styles.nodeItem}`} onMouseEnter={() => setShowMenu(node.id)} onMouseLeave={() => setShowMenu(null)}                        >
                            <div className="d-flex align-items-center" onClick={() => handleNodeClick(node.url)}>
                                {/* Node Name and Icon */}
                                <i className={`bi ${node.icon} me-2`} />
                                <span>{node.name}</span>
                            </div>

                            {/* Chevron for expanding/collapsing at the end */}
                            <div className="d-flex align-items-center">
                                {node.children && node.children.length > 0 && (
                                    <i
                                        className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} ${styles.chevron}`}
                                        onClick={() => handleToggle(node.id)}
                                    />
                                )}

                                {/* Three dots button for nodes without children */}
                                {!node.children?.length && showMenu === node.id && (
                                    <div className={styles.threeDots} onClick={(event) => handleContextMenu(event, node.id)} >
                                        <i className="bi bi-three-dots" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recursively render children */}
                        {node.expanded && node.children && renderTreeNodes(node.children, level + 1)}
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div>
            {renderTreeNodes(treeData)}
            {/* Context Menu */}
            {contextMenu.visible && (
                <div
                    className={`position-fixed ${styles.contextMenu}`}
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                    onClick={closeContextMenu}
                    onMouseLeave={() => closeContextMenu()}
                >
                    <ul>
                        <li onClick={() => openDialog(currentNode!)}>Add Sibling Node</li>
                        <li onClick={() => openDialog(currentNode!)}>Add Child Node</li>
                    </ul>
                </div>
            )}

            {/* Dialog for adding node */}
            {showDialog && (
                <div className={styles.dialog}>
                    <div className="modal-dialog-centered border border-primary bg bg-white">
                        <div className='p-5'>
                            <h5>Add New Node</h5>
                            <form>
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" className="form-control mb-2" placeholder="Enter node name" />
                                </div>
                                <div className="form-group">
                                    <label>Icon</label>
                                    <input type="text" className="form-control mb-2" placeholder="Bootstrap icon class" />
                                </div>
                                <div className="form-group">
                                    <label>URL</label>
                                    <input type="text" className="form-control mb-2" placeholder="Enter URL" />
                                </div>
                                {/* <div className="form-group">
                                    <label>Level</label>
                                    <input type="number" className="form-control" placeholder="Enter level" />
                                </div> */}
                                <div className='d-flex justify-content-between mt-2'>
                                    <button type="button" className="btn btn-primary" onClick={() => addNode(currentNode!)}>
                                        Add
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => handleCancel()}>
                                        Cancle
                                    </button>
                                </div>

                            </form>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeView;
