document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const gridContent = document.getElementById('grid-content');
    const addFolderButton = document.getElementById('add-folder');
    const addTextButton = document.getElementById('add-text');
    const addImageButton = document.getElementById('add-image');

    let isPanning = false;
    let isDraggingItem = false;
    let startX, startY;
    let offsetX = 0, offsetY = 0;
    let draggedItem = null;
    
    let itemStartX, itemStartY; // Keep track of item start position when dragging
    
    // Track the current zoom level
    let scale = 1;
    const scaleFactor = 0.1;
    const minScale = 0.2;
    const maxScale = 2;

    // Helper function to add draggable items to the grid
    function addItem(type, content = '') {
        const item = document.createElement('div');
        item.classList.add('item', type);

        if (type === 'text') {
            item.innerText = content || 'Sample Text';
            item.contentEditable = true;
            item.style.whiteSpace = 'nowrap';  // Prevent text from wrapping
        } else if (type === 'folder') {
            item.innerText = content || 'New Folder';
            item.style.whiteSpace = 'nowrap';  // Prevent folder name from wrapping
        } else if (type === 'image') {
            const img = document.createElement('img');
            img.src = content || 'https://via.placeholder.com/100';
            img.style.pointerEvents = 'none';
            item.appendChild(img);
        }

        item.style.position = 'absolute';
        item.style.left = '100px';
        item.style.top = '100px';
        item.style.width = '120px'; // Ensure fixed width
        item.style.height = 'auto'; // Ensure height adapts
        item.style.maxWidth = '120px'; // Prevent it from growing too large
        item.style.overflow = 'hidden'; // Hide overflow text
        item.classList.add('draggable');

        gridContent.appendChild(item);

        item.addEventListener('mousedown', (event) => {
            if (event.button === 0) {  // Left mouse button
                isDraggingItem = true;
                draggedItem = item;
                startX = event.clientX;
                startY = event.clientY;

                // Record the current item's position
                itemStartX = parseInt(draggedItem.style.left, 10);
                itemStartY = parseInt(draggedItem.style.top, 10);

                gridContainer.style.cursor = 'grabbing';
                event.preventDefault();
            }
        });
    }

    // Mouse down starts panning
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
            const dx = event.clientX - startX;
            const dy = event.clientY - startY;
            offsetX += dx;
            offsetY += dy;
            gridContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
            gridContainer.style.backgroundPosition = `${offsetX}px ${offsetY}px`;

            startX = event.clientX;
            startY = event.clientY;
        }

        if (isDraggingItem && draggedItem) {
            // Adjust for zoom level
            const dx = (event.clientX - startX) / scale;
            const dy = (event.clientY - startY) / scale;

            draggedItem.style.left = `${itemStartX + dx}px`;
            draggedItem.style.top = `${itemStartY + dy}px`;
        }
    });

    // Stop panning or dragging when mouse button is released
    gridContainer.addEventListener('mouseup', () => {
        isPanning = false;
        isDraggingItem = false;
        draggedItem = null;
        gridContainer.style.cursor = 'grab';
    });

    // Zoom functionality: mouse wheel event
    gridContainer.addEventListener('wheel', (event) => {
        event.preventDefault(); // Prevent default scrolling

        // Calculate the new scale factor
        if (event.deltaY < 0) {
            // Zoom in
            scale = Math.min(maxScale, scale + scaleFactor);
        } else {
            // Zoom out
            scale = Math.max(minScale, scale - scaleFactor);
        }

        // Apply the scale to both grid content and grid container
        gridContent.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
        gridContainer.style.backgroundSize = `${50 * scale}px ${50 * scale}px`; // Scale background
    });

    // Mouse leaves the grid area
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
