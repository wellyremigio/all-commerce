// src/services/logService.js

import api from './api';

export const logActivity = (description) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user ? user.email : 'Sistema';

    const newLog = {
        description: `${description} (por ${userEmail})`,
        timestamp: new Date().toISOString(),
    };

    api.post('/logs', newLog)
        .catch(error => console.error("Falha ao registrar log de atividade:", error));
};