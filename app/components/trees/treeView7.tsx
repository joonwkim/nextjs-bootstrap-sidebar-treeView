import React, { useState } from 'react';
import { TreeNode } from '../../types/treeMenu';  // Import TreeNode from 'types/treeMenu.ts'
import styles from '../../styles/trees/treeView7.module.css';  // Import styles from 'treeView.module.css'
import { useRouter } from 'next/navigation';  // Import useRouter for navigation

interface TreeViewProps {
    nodes: TreeNode[];
}

const TreeView7: React.FC<TreeViewProps> = ({ nodes }) => {
    const router = useRouter();
    const [treeData, setTreeData] = useState<TreeNode[]>(nodes);
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean; nodeId: string | null }>({ x: 0, y: 0, visible: false, nodeId: null });
    const [dialogOpen, setDialogOpen] = useState(false);
    const [newNode, setNewNode] = useState<{ name: string; icon: string; url: string }>({ name: '', icon: '', url: '' });

    // Toggle node expansion
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

    // Handle node expansion toggle
    const handleToggle = (id: string) => {
        setTreeData(toggleNode(id, treeData));
    };

    // Handle node name click for routing
    const handleNodeClick = (url: string | undefined) => {
        if (url) {
            router.push(url);
        }
    };

    // Handle context menu show
    const handleContextMenu = (e: React.MouseEvent, nodeId: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, visible: true, nodeId });
    };

    // Handle adding a new node
    const handleAddNode = () => {
        const newTree = treeData.map(node => {
            if (node.id === contextMenu.nodeId) {
                const newChild: TreeNode = {
                    id: Math.random().toString(), // Generate unique id
                    name: newNode.name,
                    icon: newNode.icon,
                    url: newNode.url,
                    expanded: false,
                    level: node.level + 1,
                    children: []
                };
                return { ...node, children: [...(node.children || []), newChild] };
            }
            return node;
        });
        setTreeData(newTree);
        setDialogOpen(false);
        setContextMenu({ ...contextMenu, visible: false });
    };

    // Close context menu when mouse moves out
    const closeContextMenu = () => setContextMenu({ ...contextMenu, visible: false });

    // Recursive rendering of tree nodes
    const renderTreeNodes = (nodeList: TreeNode[], level = 0) => {
        return (
            <ul className={`list-unstyled ms-${level * 2}`}>
                {nodeList.map(node => (
                    <li key={node.id} className={styles.nodeItem} onMouseLeave={closeContextMenu}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                {/* Node name and icon */}
                                <i className={`bi ${node.icon} me-2`} />
                                <span className={styles.nodeName} onClick={() => handleNodeClick(node.url)}>{node.name}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                {/* Chevron icon for nodes with children */}
                                {node.children && node.children.length > 0 && (
                                    <i
                                        className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2 ${styles.chevron}`}
                                        onClick={() => handleToggle(node.id)}
                                    />
                                )}
                                {/* Three-dot menu for nodes without children */}
                                {!node.children && (
                                    <div className={styles.threeDots} onContextMenu={(e) => handleContextMenu(e, node.id)}>
                                        <i className="bi bi-three-dots"></i>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Recursively render children if expanded */}
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
                    className={`${styles.contextMenu} ${styles.darkMode}`}
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                    onMouseLeave={closeContextMenu}
                >
                    <div onClick={() => setDialogOpen(true)}>Add Sibling</div>
                    <div onClick={() => setDialogOpen(true)}>Add Child</div>
                </div>
            )}

            {/* Dialog for adding new node */}
            {dialogOpen && (
                <div className={styles.dialog}>
                    <h4>Add Node</h4>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="nodeName" className="form-label">Node Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nodeName"
                                value={newNode.name}
                                onChange={(e) => setNewNode({ ...newNode, name: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nodeIcon" className="form-label">Icon</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nodeIcon"
                                value={newNode.icon}
                                onChange={(e) => setNewNode({ ...newNode, icon: e.target.value })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="nodeUrl" className="form-label">URL</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nodeUrl"
                                value={newNode.url}
                                onChange={(e) => setNewNode({ ...newNode, url: e.target.value })}
                            />
                        </div>
                        <button type="button" className="btn btn-primary" onClick={handleAddNode}>Add</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Cancel</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default TreeView7;
