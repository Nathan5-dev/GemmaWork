# GemmaWork RDC — Assistant IA de Productivité & Business pour la RDC

**GemmaWork RDC** est un assistant web d'intelligence artificielle de productivité et de rédaction professionnelle spécialement conçu pour les PME, ONG, startups, étudiants, entrepreneurs et administrations de la République Démocratique du Congo (RDC).

---

## 🌟 Fonctionnalités Clés (MVP)

1. **Business Plan IA**
   - Transformation des idées d'activités en business plans structurés et adaptés au contexte socio-économique congolais.
   - Inclut : Résumé exécutif, analyse de marché locale (Kinshasa, Goma, Lubumbashi...), modèle économique, budget, gestion des risques et plan d'action priorisé.
   - Gestion stricte sans fausses statistiques : Marquage clair `[Hypothèse : ...]` pour toute information absente.

2. **Documents Administratifs IA**
   - Génération de lettres officielles, demandes de stage/service, notes de service, comptes-rendus, attestations et lettres de motivation.
   - Respect strict des formules de politesse et en-têtes officiels sans invention de fausses données réelles.

3. **E-mail Professionnel IA**
   - Rédaction d'e-mails professionnels concis avec sélection de ton (Formel, Neutre, Cordial, Persuasif, Direct) et de longueur.
   - **Actions Rapides sur brouillon :** Raccourcir, Développer, Rendre plus formel, Traduire.

4. **Multi-langue & Export**
   - Interface et documents disponibles en **Français**, **Anglais** et **Kiswahili**.
   - Zone d'édition dynamique avant copie dans le presse-papier ou export direct en **PDF**.

---

## 🏗️ Architecture Technique

- **Backend :** Express / Node.js avec TypeScript (`server.ts`).
- **Frontend :** React 19 + Vite + Tailwind CSS 4 + Lucide Icons.
- **Intégration IA :** `@google/genai` (SDK Google GenAI avec modèle `gemini-3.6-flash`).
- **Export PDF :** `jspdf` avec mise en page personnalisée en-tête / pied de page.

---

## 🚀 Installation & Lancement Local

### 1. Prérequis
- Node.js (v18+)
- npm ou yarn

### 2. Cloner le projet et installer les dépendances
```bash
npm install
```

### 3. Configuration des variables d'environnement
Copiez le fichier exemple `.env.example` :
```bash
cp .env.example .env
```
Ajoutez votre clé API Gemini si disponible :
```env
GEMINI_API_KEY="votre_cle_api_gemini"
```
> *Note : Si la clé API n'est pas fournie, l'application s'exécute automatiquement en **Mode Démonstration**, produisant des réponses structurées adaptées à la RDC.*

### 4. Démarrer en mode Développement
```bash
npm run dev
```
L'application s'exécute sur `http://localhost:3000`.

### 5. Compiler et Démarrer en Production
```bash
npm run build
npm start
```

---

## 🧪 Tests & Linting

Pour vérifier la conformité TypeScript :
```bash
npm run lint
```

---

## 📄 Licence
Sous licence Apache 2.0. Conçu pour le développement économique et la productivité numérique en République Démocratique du Congo.
