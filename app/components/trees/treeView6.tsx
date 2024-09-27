import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { TreeNode } from '../../types/treeMenu';  // Import the TreeNode type
import styles from '../../styles/trees/treeView6.module.css';  // Import styles

// Props definition
interface TreeViewProps {
    nodes: TreeNode[];
}

const TreeView6: React.FC<TreeViewProps> = ({ nodes }) => {
    const [treeData, setTreeData] = useState<TreeNode[]>(nodes);
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

    const handleContextMenu = (event: React.MouseEvent, nodeId: string) => {
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

    const handleNodeClick = (url?: string) => {
        if (url) {
            router.push(url); // Navigate to the specified page
        }
    };

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

    const renderTreeNodes = (nodeList: TreeNode[], level = 0) => {
        return (
            <ul className={`list-unstyled ms-${level * 2}`}>
                {nodeList.map(node => (
                    <li key={node.id} className={styles.treeNode}>
                        <div
                            className="d-flex align-items-center justify-content-between"
                            onMouseEnter={() => handleContextMenu} // Show three dots on hover
                        >
                            <div className="d-flex align-items-center" onClick={() => handleNodeClick(node.url)}>
                                <i className={`bi ${node.icon} me-2`} />
                                <span>{node.name}</span>
                            </div>

                            {/* Expander chevron at the end of the node */}
                            <div className="d-flex align-items-center">
                                {node.children && node.children.length > 0 ? (
                                    <i
                                        className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} ms-auto`}
                                        onClick={() => handleToggle(node.id)}
                                    />
                                ) : (
                                    // Three dots appear when the node has no children
                                    <i
                                        className={`bi bi-three-dots ${styles.threeDots}`}
                                        onClick={(event) => handleContextMenu(event, node.id)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Render child nodes if expanded */}
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
                    <div className="modal-dialog-centered">
                        <h5>Add New Node</h5>
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className="form-control" placeholder="Enter node name" />
                            </div>
                            <div className="form-group">
                                <label>Icon</label>
                                <input type="text" className="form-control" placeholder="Bootstrap icon class" />
                            </div>
                            <div className="form-group">
                                <label>URL</label>
                                <input type="text" className="form-control" placeholder="Enter URL" />
                            </div>
                            <div className="form-group">
                                <label>Level</label>
                                <input type="number" className="form-control" placeholder="Enter level" />
                            </div>
                            <button type="button" className="btn btn-primary" onClick={() => addNode(currentNode!)}>
                                Add Node
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeView6;
