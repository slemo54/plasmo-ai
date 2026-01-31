# 🚀 Guida Rapida Deploy - Plasmo AI

## 📋 Checklist Pre-Deploy

- [ ] Repository creato su GitHub
- [ ] Progetto Supabase creato
- [ ] API Key Google AI ottenuta
- [ ] File `.env.local` configurato

---

## 1️⃣ Setup Supabase (Database)

### Passo 1: Crea Account e Progetto
1. Vai su [https://supabase.com](https://supabase.com)
2. Registrati con GitHub
3. Crea nuovo progetto
4. Aspetta che il database sia pronto (~2 min)

### Passo 2: Configura Database
1. Vai su **SQL Editor** (nel menu laterale)
2. Clicca **New Query**
3. Copia e incolla il contenuto di `supabase-setup.sql`
4. Clicca **Run**

### Passo 3: Ottieni le Chiavi
1. Vai su **Project Settings > API**
2. Copia questi valori:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

---

## 2️⃣ Setup Google AI

1. Vai su [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Clicca **Create API Key**
3. Seleziona un progetto (o creane uno nuovo)
4. Copia la chiave → `GOOGLE_AI_API_KEY`

---

## 3️⃣ Deploy su Vercel

### Opzione A: Deploy da GitHub (Consigliata)

1. Push del codice su GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TUO_USERNAME/plasmo-ai.git
git push -u origin main
```

2. Vai su [https://vercel.com](https://vercel.com)
3. Clicca **Add New Project**
4. Importa da GitHub → seleziona `plasmo-ai`
5. In **Environment Variables**, aggiungi:

| Nome | Valore |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | https://xxxx.supabase.co |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | eyJ... |
| `SUPABASE_SERVICE_ROLE_KEY` | eyJ... |
| `GOOGLE_AI_API_KEY` | AIza... |

6. Clicca **Deploy**

### Opzione B: Deploy da CLI

```bash
# Installa Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod
```

---

## 4️⃣ Configurazione Post-Deploy

### Configura URL di Redirect (IMPORTANTE!)

1. In Supabase, vai su **Authentication > URL Configuration**
2. Imposta:
   - **Site URL**: `https://tuo-progetto.vercel.app`
   - Aggiungi in **Redirect URLs**: `https://tuo-progetto.vercel.app/auth/callback`

### Verifica Funzionamento

1. Apri il tuo sito deployato
2. Clicca "Inizia Gratis"
3. Registra un nuovo account
4. Dovresti ricevere 8 crediti automaticamente
5. Prova a generare un video

---

## 🔧 Variabili Ambiente Completa

### Per Sviluppo Locale (`.env.local`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GOOGLE_AI_API_KEY=AIza...
NEXT_PUBLIC_APP_NAME=Plasmo AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Per Produzione (Vercel):
Le stesse variabili, ma con:
```env
NEXT_PUBLIC_APP_URL=https://tuo-dominio.vercel.app
```

---

## ⚠️ Troubleshooting

### Errore: "Crediti insufficienti" al primo login
**Causa**: Il trigger non ha creato il profilo
**Soluzione**: 
```sql
-- In SQL Editor di Supabase
INSERT INTO profiles (id, email, credits) 
SELECT id, email, 8 FROM auth.users 
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.users.id);
```

### Errore: "API key non valida"
**Causa**: Chiave Google AI errata o non attiva
**Soluzione**: 
- Verifica la chiave in [Google AI Studio](https://aistudio.google.com/app/apikey)
- Assicurati che l'API Veo sia abilitata

### Errore: "Non autenticato"
**Causa**: Sessione scaduta o URL redirect errato
**Soluzione**:
- Verifica URL di callback in Supabase Auth settings
- Controlla che corrisponda al tuo dominio Vercel

### Video non si carica
**Causa**: Storage non configurato
**Soluzione**:
1. In Supabase, vai su **Storage**
2. Crea bucket "videos" (pubblico)
3. Verifica le policies di storage

---

## 💰 Gestione Crediti

### Aggiungere crediti a un utente:
```sql
-- Aggiungi 100 crediti
UPDATE profiles SET credits = credits + 100 WHERE email = 'utente@email.com';

-- Registra transazione
INSERT INTO credit_transactions (user_id, amount, type, description)
SELECT id, 100, 'purchase', 'Ricarica manuale' FROM profiles WHERE email = 'utente@email.com';
```

---

## 📞 Supporto

- **Documentazione Next.js**: https://nextjs.org/docs
- **Documentazione Supabase**: https://supabase.com/docs
- **Documentazione Google AI**: https://ai.google.dev/docs

---

**Buona creazione!** 🎬✨
