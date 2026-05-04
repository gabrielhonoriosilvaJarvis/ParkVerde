// ⚠️ IMPORTANTE: Substitua com suas credenciais do Firebase
// Acesse: https://console.firebase.google.com > Seu Projeto > Configurações > Seus Apps


npm install firebase

const firebaseConfig = {
    apiKey: "AIzaSyDIVrG1x2z3-z4z5z6z7z8z9z0z1z2z3z",
    authDomain: "seu-projeto-parkeverde.firebaseapp.com",
    projectId: "seu-projeto-parkeverde",
    storageBucket: "seu-projeto-parkeverde.appspot.com",
    messagingSenderId: "123456789000",
    appId: "1:123456789000:web:a1b2c3d4e5f6g7h8i9j0"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Função para sincronizar dados com Firebase
function syncData(key) {
    try {
        db.ref(`parkVerde/${key}`).set({
            payments: paymentStatus,
            persons: parcelaPersons,
            values: parcelaValues,
            timestamp: new Date().toISOString()
        }).catch(error => {
            console.error("Erro ao sincronizar com Firebase:", error);
        });
    } catch (error) {
        console.error("Erro na sincronização:", error);
    }
}

// Função para carregar dados do Firebase
function loadDataFromFirebase() {
    db.ref('parkVerde/dados').on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            paymentStatus = data.payments || {};
            parcelaPersons = data.persons || {};
            parcelaValues = data.values || {};
            
            console.log("✅ Dados carregados do Firebase");
            renderSummary();
            applyFilters();
        } else {
            console.log("📝 Nenhum dado no Firebase ainda");
            loadData(); // Carrega do localStorage se Firebase vazio
        }
    });
}

// Sincronizar quando houver mudanças (cada 2 segundos para evitar sobrecarga)
let lastSync = 0;
function debouncedSync() {
    const now = Date.now();
    if (now - lastSync > 2000) {
        syncData('dados');
        lastSync = now;
    }
}
