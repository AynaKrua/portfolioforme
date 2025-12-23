// === Искорки для ВСЕХ изображений (включая динамические) ===
function initSparks() {
  // Удаляем старые обработчики, если были
  document.querySelectorAll('img').forEach(img => {
    if (img._sparkHandler) {
      img.removeEventListener('mouseenter', img._sparkHandler);
      img.removeEventListener('mouseleave', img._sparkClearHandler);
    }
  });

  // Назначаем новые обработчики
  document.querySelectorAll('img').forEach(img => {
    let sparkInterval = null;

    const createSpark = () => {
      const rect = img.getBoundingClientRect();
      const spark = document.createElement('div');

      const colors = [
        'rgba(184, 134, 255, 0.95)', // #b886ff — твой акцент
        'rgba(139, 92, 246, 0.9)',   // фиолетовый
        'rgba(45, 224, 167, 0.85)'   // бирюза
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = 2.5 + Math.random() * 1.5;

      spark.style.position = 'fixed';
      spark.style.width = `${size}px`;
      spark.style.height = `${size}px`;
      spark.style.borderRadius = '50%';
      spark.style.backgroundColor = color;
      spark.style.boxShadow = `0 0 8px ${color}, 0 0 16px ${color}`;
      spark.style.pointerEvents = 'none';
      spark.style.zIndex = '1000';

      const angle = Math.random() * Math.PI * 2;
      const radius = Math.max(rect.width, rect.height) * 0.5 + 8 + Math.random() * 25;
      const x = rect.left + rect.width / 2 + Math.cos(angle) * radius;
      const y = rect.top + rect.height / 2 + Math.sin(angle) * radius;

      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      document.body.appendChild(spark);

      const duration = 1200 + Math.random() * 600;
      spark.animate(
        [
          { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          {
            transform: `translate(${(Math.random() - 0.5) * 70}px, ${(Math.random() - 0.5) * 70}px) scale(0)`,
            opacity: 0
          }
        ],
        { duration, easing: 'cubic-bezier(0.2, 0.8, 0.4, 1)' }
      );

      setTimeout(() => {
        if (spark.parentNode) spark.remove();
      }, duration);
    };

    const startSparks = () => {
      if (!sparkInterval) {
        sparkInterval = setInterval(createSpark, 110);
      }
    };

    const stopSparks = () => {
      if (sparkInterval) {
        clearInterval(sparkInterval);
        sparkInterval = null;
      }
    };

    img.addEventListener('mouseenter', startSparks);
    img.addEventListener('mouseleave', stopSparks);

    // Сохраняем ссылки для возможного удаления
    img._sparkHandler = startSparks;
    img._sparkClearHandler = stopSparks;
  });
}

// Запуск при загрузке страницы
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSparks);
} else {
  initSparks();
}

// ⚡️ Дополнительно: перезапуск искорок при изменении DOM (например, после создания карусели)
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.addedNodes.length > 0) {
      initSparks(); // Пересканируем все img
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});