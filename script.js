document.addEventListener('DOMContentLoaded', () => {
    const draggables = document.querySelectorAll('.draggable-item');
    const containers = document.querySelectorAll('.tier-content, .item-bank');
    const addItemBtn = document.getElementById('add-item');
    const resetBtn = document.getElementById('reset-list');
    const itemBank = document.getElementById('item-bank');

    // Initialize drag events for existing items
    draggables.forEach(draggable => {
        addDragEvents(draggable);
    });

    // Set up drop zones
    containers.forEach(container => {
        container.addEventListener('dragover', e => {
            e.preventDefault();
            container.classList.add('drag-over');
        });

        container.addEventListener('dragleave', () => {
            container.classList.remove('drag-over');
        });

        container.addEventListener('drop', e => {
            e.preventDefault();
            container.classList.remove('drag-over');
            const draggingId = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(draggingId);
            if (draggable) {
                container.appendChild(draggable);
            }
        });
    });

    // Helper to add events to an item
    function addDragEvents(item) {
        item.addEventListener('dragstart', (e) => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.id);
        });

        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
        });
    }

    // Add new item functionality
    addItemBtn.addEventListener('click', () => {
        const url = prompt('Enter image URL:');
        if (url) {
            const id = 'item-' + Date.now();
            const newItem = document.createElement('div');
            newItem.classList.add('draggable-item');
            newItem.setAttribute('draggable', 'true');
            newItem.id = id;
            
            const img = document.createElement('img');
            img.src = url;
            img.onerror = () => {
                alert('Invalid image URL');
                newItem.remove();
            };
            
            newItem.appendChild(img);
            itemBank.appendChild(newItem);
            addDragEvents(newItem);
        }
    });

    // Reset functionality (moves everything back to bank)
    resetBtn.addEventListener('click', () => {
        const allItems = document.querySelectorAll('.draggable-item');
        allItems.forEach(item => {
            itemBank.appendChild(item);
        });
    });
});
