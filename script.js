import CONFIG from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const tierListContainer = document.getElementById('capture-area');
    const itemBank = document.getElementById('item-bank');
    const saveBtn = document.getElementById('save-image');
    const shareTgBtn = document.getElementById('share-tg');
    const resetBtn = document.getElementById('reset-list');

    // 1. Создаем тиры на основе конфига
    CONFIG.tiers.forEach(tier => {
        const row = document.createElement('div');
        row.className = 'tier-row';
        row.innerHTML = `
            <div class="tier-label" style="background-color: ${tier.color}">${tier.name}</div>
            <div class="tier-content"></div>
        `;
        tierListContainer.appendChild(row);
    });

    // 2. Загружаем картинки из папки на основе конфига
    CONFIG.images.forEach((imgName, index) => {
        const item = document.createElement('div');
        item.className = 'draggable-item';
        item.draggable = true;
        item.id = `item-${index}`;
        
        const img = document.createElement('img');
        img.src = CONFIG.imageFolder + imgName;
        img.alt = imgName;
        
        item.appendChild(img);
        itemBank.appendChild(item);
        addDragEvents(item);
    });

    // Настройка зон сброса (включая банк предметов)
    const containers = document.querySelectorAll('.tier-content, .item-bank');
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
            const id = e.dataTransfer.getData('text/plain');
            const draggable = document.getElementById(id);
            if (draggable) container.appendChild(draggable);
        });
    });

    function addDragEvents(item) {
        item.addEventListener('dragstart', e => {
            item.classList.add('dragging');
            e.dataTransfer.setData('text/plain', item.id);
        });
        item.addEventListener('dragend', () => item.classList.remove('dragging'));
    }

    // Сохранение в картинку
    saveBtn.addEventListener('click', async () => {
        const canvas = await html2canvas(tierListContainer);
        const link = document.createElement('a');
        link.download = 'my-tier-list.png';
        link.href = canvas.toDataURL();
        link.click();
    });

    // Поделиться в Телеграм
    shareTgBtn.addEventListener('click', async () => {
        // Так как напрямую отправить файл в ТГ через JS сложно (нужен сервер/бот),
        // мы предложим сохранить картинку и дадим ссылку на ТГ для отправки текста/ссылки
        const canvas = await html2canvas(tierListContainer);
        const dataUrl = canvas.toDataURL();
        
        // В браузерах можно вызвать системное меню "Поделиться"
        if (navigator.share) {
            canvas.toBlob(async (blob) => {
                const file = new File([blob], 'tier-list.png', { type: 'image/png' });
                try {
                    await navigator.share({
                        title: 'My Tier List',
                        text: 'Check out my tier list!',
                        files: [file]
                    });
                } catch (err) {
                    console.log('Share failed', err);
                }
            });
        } else {
            // Если Web Share API не поддерживается, просто открываем ТГ с текстом
            const text = encodeURIComponent("Посмотри мой Тир Лист! Заходи и сделай свой: " + window.location.href);
            window.open(`https://t.me/share/url?url=${text}`);
        }
    });

    resetBtn.addEventListener('click', () => {
        const allItems = document.querySelectorAll('.draggable-item');
        allItems.forEach(item => itemBank.appendChild(item));
    });
});
