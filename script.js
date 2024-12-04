const hierarchy = [];
let nodeIdCounter = 1;
let selectedParentNode = null;

function addNode() {
  const nodeName = document.getElementById("nodeName").value.trim();

  if (!nodeName) {
    alert("Please enter a name.");
    return;
  }

  const newNodeId = nodeIdCounter++;
  const newNode = { id: newNodeId, name: nodeName, children: [] };
  hierarchy.push(newNode);

  renderTree();
  document.getElementById("nodeName").value = "";
}

function showAddChildModal(parentNode) {
  const modal = document.getElementById("addChildModal");
  modal.style.display = "block";
  selectedParentNode = parentNode;
  document.getElementById("childNodeName").value = "";
  document.getElementById("childNodeName").focus();
}

function closeModal() {
  const modal = document.getElementById("addChildModal");
  modal.style.display = "none";
  selectedParentNode = null;
}

document.querySelector(".close").onclick = closeModal;
window.onclick = function(event) {
  const modal = document.getElementById("addChildModal");
  if (event.target == modal) {
    closeModal();
  }
}

function addChildNode() {
  const childName = document.getElementById("childNodeName").value.trim();
  
  if (!childName) {
    alert("Please enter a name for the child node.");
    return;
  }

  if (selectedParentNode) {
    const newNodeId = `${selectedParentNode.id}.${selectedParentNode.children.length + 1}`;
    const newNode = { id: newNodeId, name: childName, children: [] };
    selectedParentNode.children.push(newNode);
    
    renderTree();
    closeModal();
  }
}

function renderTree() {
  const treeContainer = document.getElementById("treeContainer");
  treeContainer.innerHTML = "";
  const ul = document.createElement("ul");
  createTreeNodes(hierarchy, ul);
  treeContainer.appendChild(ul);
}

function createTreeNodes(nodes, container) {
  nodes.forEach((node) => {
    const li = document.createElement("li");
    
    const nodeContent = document.createElement("div");
    nodeContent.className = "node-content";
    
    const toggleSpan = document.createElement("span");
    toggleSpan.className = "toggle-btn";
    if (node.children.length > 0) {
      toggleSpan.innerHTML = '<i class="fas fa-chevron-down"></i>';
      toggleSpan.onclick = (e) => {
        e.stopPropagation();
        toggleChildren(li, toggleSpan);
      };
    }
    nodeContent.appendChild(toggleSpan);
    
    const nameSpan = document.createElement("span");
    nameSpan.className = "node-name";
    nameSpan.textContent = `${node.id}. ${node.name}`;
    nodeContent.appendChild(nameSpan);
    
    const actions = document.createElement("div");
    actions.className = "node-actions";
    
    const addButton = document.createElement("button");
    addButton.innerHTML = '<i class="fas fa-plus"></i>';
    addButton.className = "add-btn icon-btn";
    addButton.title = "Add Child";
    addButton.onclick = () => showAddChildModal(node);
    actions.appendChild(addButton);
    
    const editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = "edit-btn icon-btn";
    editButton.title = "Edit";
    editButton.onclick = () => editNode(node);
    actions.appendChild(editButton);
    
    const removeButton = document.createElement("button");
    removeButton.innerHTML = '<i class="fas fa-trash"></i>';
    removeButton.className = "remove-btn icon-btn";
    removeButton.title = "Remove";
    removeButton.onclick = () => removeNode(node.name);
    actions.appendChild(removeButton);
    
    nodeContent.appendChild(actions);
    li.appendChild(nodeContent);

    if (node.children.length > 0) {
      const childUl = document.createElement("ul");
      childUl.className = "child-list expanded";
      createTreeNodes(node.children, childUl);
      li.appendChild(childUl);
    }

    container.appendChild(li);
  });
}

function toggleChildren(li, toggleSpan) {
  const childList = li.querySelector('.child-list');
  const icon = toggleSpan.querySelector('i');
  
  if (childList.classList.contains('expanded')) {
    childList.classList.remove('expanded');
    childList.classList.add('collapsed');
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-right');
  } else {
    childList.classList.remove('collapsed');
    childList.classList.add('expanded');
    icon.classList.remove('fa-chevron-right');
    icon.classList.add('fa-chevron-down');
  }
}

function getNodeLevel(nodes, targetNode, level = 0) {
  for (const node of nodes) {
    if (node === targetNode) {
      return level;
    }
    if (node.children.length > 0) {
      const childLevel = getNodeLevel(node.children, targetNode, level + 1);
      if (childLevel !== -1) {
        return childLevel;
      }
    }
  }
  return -1;
}

function editNode(node) {
  const newName = prompt("Enter new name:", node.name);
  if (newName) {
    node.name = newName;
    renderTree();
  }
}

function removeNode(nodeName) {
  if (confirm(`Are you sure you want to remove "${nodeName}" and all its children?`)) {
    removeNodeFromHierarchy(hierarchy, nodeName);
    renderTree();
  }
}

function removeNodeFromHierarchy(nodes, name) {
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i].name === name) {
      nodes.splice(i, 1);
      return true;
    }
    if (nodes[i].children.length > 0) {
      if (removeNodeFromHierarchy(nodes[i].children, name)) {
        return true;
      }
    }
  }
  return false;
}

// Initialize dropdowns on page load
renderTree();
