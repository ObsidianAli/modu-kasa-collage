document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const gridContent = document.getElementById('grid-content');
    const addFolderButton = document.getElementById('add-folder');
    const addTextButton = document.getElementById('add-text');
    const addImageButton = document.getElementById('add-image');

    let isPanning = false;
    let isDraggingItem = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0; // Track how far we've panned
    let draggedItem = null;

    // Helper function to add draggable items to the grid
    function addItem(type, content = '') {
        const item = document.createElement('div');
        item.classList.add('item', type);

        if (type === 'text') {
            item.innerText = content || 'Sample Text';
            item.contentEditable = true; // Allow inline editing
        } else if (type === 'folder') {
            item.innerText = content || 'New Folder';
        } else if (type === 'image') {
            const img = document.createElement('img');
            img.src = content || 'https://via.placeholder.com/100'; // Placeholder image
            item.appendChild(img);
        }

        // Set the initial position of the item within the grid content
        item.style.left = '100px';
        item.style.top = '100px';
        item.classList.add('draggable');

        // Add the item to the grid content area
        gridContent.appendChild(item);

        // Enable dragging the item with the left mouse button
        item.addEventListener('mousedown', (event) => {
            if (event.button === 0) {  // Left mouse button
                isDraggingItem = true;
                draggedItem = item;
                startX = event.clientX;
                startY = event.clientY;
                gridContainer.style.cursor = 'grabbing';
            }
        });
    }

    // Mouse down starts panning with middle mouse button
    gridContainer.addEventListener('mousedown', (event) => {
        if (event.button === 1) {  // Middle mouse button
            isPanning = true;
            startX = event.clientX;
            startY = event.clientY;
            gridContainer.style.cursor = 'grabbing';
        }
    });

    // Mouse move handles panning and item dragging
    gridContainer.addEventListener('mousemove', (event) => {
        if (isPanning) {
            // Calculate how far the mouse has moved
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            // Update the offsets and apply them to both grid content and background grid
            offsetX += dx;
            offsetY += dy;

            // Move the items and background together
            gridContent.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
            gridContainer.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

            // Update the starting point for the next move event
            startX = event.clientX;
            startY = event.clientY;
        }

        if (isDraggingItem && draggedItem) {
            // Move the dragged item
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;

            const currentLeft = parseInt(draggedItem.style.left, 10);
            const currentTop = parseInt(draggedItem.style.top, 10);

            draggedItem.style.left = `${currentLeft + dx}px`;
            draggedItem.style.top = `${currentTop + dy}px`;

            // Update the starting point for the next move event
            startX = event.clientX;
            startY = event.clientY;
        }
    });

    // Mouse up stops both panning and item dragging
    gridContainer.addEventListener('mouseup', () => {
        isPanning = false;
        isDraggingItem = false;
        draggedItem = null;
        gridContainer.style.cursor = 'grab';
    });

    // Stop panning or dragging when mouse leaves the grid
    gridContainer.addEventListener('mouseleave', () => {
        isPanning = false;
        isDraggingItem = false;
        draggedItem = null;
        gridContainer.style.cursor = 'grab';
    });

    // Add folder, text, and image on button click
    addFolderButton.addEventListener('click', () => addItem('folder'));
    addTextButton.addEventListener('click', () => addItem('text'));
    addImageButton.addEventListener('click', () => addItem('image'));
});
