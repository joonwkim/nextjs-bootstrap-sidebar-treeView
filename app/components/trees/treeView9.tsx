import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation
import { TreeNode } from '../../types/treeMenu';  // Import the TreeNode type
import styles from '../../styles/trees/treeView9.module.css';  // Import styles

// Props definition
interface TreeViewProps {
    nodes: TreeNode[];
}

const TreeView9: React.FC<TreeViewProps> = ({ nodes }) => {
    const [treeData, setTreeData] = useState<TreeNode[]>(nodes);
    const [contextMenu, setContextMenu] = useState<{ x: number, y: number, node: TreeNode | null }>({ x: 0, y: 0, node: null });
    const [dialogOpen, setDialogOpen] = useState<boolean>(false);
    const [newNodeInfo, setNewNodeInfo] = useState<{ name: string, url: string }>({ name: '', url: '' });

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

    const handleNodeClick = (url?: string) => {
        if (url) {
            router.push(url);
        }
    };

    const handleContextMenu = (event: React.MouseEvent, node: TreeNode) => {
        event.preventDefault();
        setContextMenu({ x: event.pageX, y: event.pageY, node });
    };

    const handleAddNode = () => {
        if (contextMenu.node) {
            const updatedTree = addNodeToTree(contextMenu.node.id, treeData, newNodeInfo);
            setTreeData(updatedTree);
            setDialogOpen(false);
            setNewNodeInfo({ name: '', url: '' });
        }
    };

    const addNodeToTree = (parentId: string, nodes: TreeNode[], newNode: { name: string, url: string }): TreeNode[] => {
        return nodes.map(node => {
            if (node.id === parentId) {
                const newChild: TreeNode = {
                    id: `${parentId}-${node.children?.length || 0 + 1}`,  // Generate a new ID
                    name: newNode.name,
                    icon: 'bi-file',  // Default icon for new nodes
                    url: newNode.url,
                    expanded: false,
                    level: node.level + 1,
                    children: [],
                };
                return { ...node, children: [...(node.children || []), newChild] };
            } else if (node.children) {
                return { ...node, children: addNodeToTree(parentId, node.children, newNode) };
            }
            return node;
        });
    };

    const renderTreeNodes = (nodeList: TreeNode[], level = 0) => {
        return (
            <ul className={`list-unstyled ms-${level * 2}`}>
                {nodeList.map(node => (
                    <li key={node.id} className={`${styles.nodeItem}`} onContextMenu={(e) => handleContextMenu(e, node)}>
                        <div className="d-flex align-items-center justify-content-between">
                            <div onClick={() => handleNodeClick(node.url)} className="d-flex align-items-center">
                                {node.children && node.children.length > 0 && (
                                    <i
                                        className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2 ${styles.chevron}`}
                                        onClick={() => handleToggle(node.id)}
                                    />
                                )}
                                <i className={`bi ${node.icon} me-2`} />
                                <span>{node.name}</span>
                            </div>
                            <div className={`${styles.actions}`}>
                                {node.children && node.children.length > 0 ? (
                                    <i className={`bi ${node.expanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2`} />
                                ) : (
                                    <i className="bi bi-three-dots-vertical" />
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
            {contextMenu.node && (
                <div
                    className={styles.contextMenu}
                    style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
                    onMouseLeave={() => setContextMenu({ x: 0, y: 0, node: null })}
                >
                    <ul>
                        <li onClick={() => setDialogOpen(true)}>Add Child Node</li>
                        <li onClick={() => setDialogOpen(true)}>Add Sibling Node</li>
                    </ul>
                </div>
            )}

            {/* Dialog for adding new node */}
            {dialogOpen && (
                <div className={styles.dialog}>
                    <div className={styles.dialogContent}>
                        <h5>Add New Node</h5>
                        <input
                            type="text"
                            placeholder="Node Name"
                            value={newNodeInfo.name}
                            onChange={(e) => setNewNodeInfo({ ...newNodeInfo, name: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="URL"
                            value={newNodeInfo.url}
                            onChange={(e) => setNewNodeInfo({ ...newNodeInfo, url: e.target.value })}
                        />
                        <div className={styles.dialogActions}>
                            <button className="btn btn-primary" onClick={handleAddNode}>Add</button>
                            <button className="btn btn-secondary" onClick={() => setDialogOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TreeView9;
