import React, { useState } from 'react';
import { TreeNode } from '../../types/treeMenu';  // Import TreeNode from 'types/treeMenu.ts'
import styles from '../../styles/trees/treeView8.module.css';  // Import styles from 'treeView.module.css'
import { useRouter } from 'next/navigation';  // Import useRouter for navigation

interface TreeViewProps {
    nodes: TreeNode[];
}
const TreeView8: React.FC<TreeViewProps> = ({ nodes }) => {
    const [treeData, setTreeData] = useState<TreeNode[]>(nodes);
    const [showContextMenu, setShowContextMenu] = useState<{ x: number, y: number, nodeId: string } | null>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [newNodeData, setNewNodeData] = useState<{ name: string, url: string }>({ name: '', url: '' });
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
        setTreeData(toggleNode(id, treeData));
    };

    const handleNameClick = (url?: string) => {
        if (url) {
            router.push(url);  // Navigate to the node's URL when clicked
        }
    };

    const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        setShowContextMenu({ x: e.clientX, y: e.clientY, nodeId });
    };

    const handleContextMenuClose = () => {
        setShowContextMenu(null);
    };

    const handleAddNode = (type: 'sibling' | 'child', nodeId: string) => {
        setShowContextMenu(null);
        setShowDialog(true);  // Open dialog to add node
    };

    const handleDialogSubmit = () => {
        // Logic to add the new node to treeData
        setShowDialog(false);
    };

    const renderTreeNodes = (nodeList: TreeNode[], level = 0) => {
        return (
            <ul className={`list-unstyled ms-${level * 2}`}>
                {nodeList.map(node => (
                    <li key={node.id} onMouseLeave={handleContextMenuClose} className={styles.treeNode}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                {node.children && node.children.length > 0 && (
                                    <i
                                        className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} ${styles.chevron}`}
                                        onClick={() => handleToggle(node.id)}
                                    />
                                )}
                                <span onClick={() => handleNameClick(node.url)} className={styles.nodeName}>
                                    <i className={`bi ${node.icon} me-2`} />
                                    {node.name}
                                </span>
                            </div>
                            <div className={styles.nodeControls}>
                                {!node.children?.length && (
                                    <i
                                        className={`bi bi-three-dots ${styles.threeDots}`}
                                        onClick={(e) => handleContextMenu(e, node.id)}
                                    />
                                )}
                            </div>
                        </div>

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
            {showContextMenu && (
                <div
                    className={styles.contextMenu}
                    style={{ top: showContextMenu.y, left: showContextMenu.x }}
                    onMouseLeave={handleContextMenuClose}
                >
                    <ul className="list-unstyled">
                        <li onClick={() => handleAddNode('sibling', showContextMenu.nodeId)}>Add Sibling Node</li>
                        <li onClick={() => handleAddNode('child', showContextMenu.nodeId)}>Add Child Node</li>
                    </ul>
                </div>
            )}

            {/* Dialog for Adding Node */}
            {showDialog && (
                <div className={styles.dialog}>
                    <h4>Add Node</h4>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newNodeData.name}
                        onChange={(e) => setNewNodeData({ ...newNodeData, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        value={newNodeData.url}
                        onChange={(e) => setNewNodeData({ ...newNodeData, url: e.target.value })}
                    />
                    <div className="mt-3">
                        <button className="btn btn-primary" onClick={handleDialogSubmit}>Add</button>
                        <button className="btn btn-secondary" onClick={() => setShowDialog(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeView8;
