if('serviceWorker' in navigator) {window.addEventListener('load', () => {navigator.serviceWorker.register('/expenses-form/sw.js', { scope: '/expenses-form/' })})}