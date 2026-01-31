# Plasmo AI

Web app italiana per la generazione di video cinematografici con intelligenza artificiale. Basata su Google Veo 3.1 e costruita con Next.js, Supabase e Tailwind CSS.

## 🚀 Caratteristiche

- **Generazione Video AI**: Crea video da testo, fotogrammi chiave o immagini di riferimento
- **Qualità Professionale**: Supporto per 720p, 1080p e 4K
- **Sistema Crediti**: Gestione crediti per le generazioni
- **Autenticazione Completa**: Login/Registrazione con Supabase Auth
- **Storico Video**: Salva e consulta tutti i video generati
- **UI Moderna**: Design dark mode responsive e intuitivo
- **Completamente in Italiano**

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) con App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage)
- **AI**: [Google GenAI](https://ai.google.dev/) (Veo 3.1)
- **Icons**: [Lucide React](https://lucide.dev/)
- **TypeScript**: Per type safety

## 📁 Struttura Progetto

```
plasmo-ai/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── generate-video/# Endpoint generazione video
│   ├── auth/callback/     # Callback OAuth
│   ├── dashboard/         # Dashboard principale (studio)
│   ├── storico/          # Storico video
│   ├── login/            # Pagina login/registrazione
│   ├── globals.css       # Stili globali
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Landing page
├── components/
│   ├── studio/           # Componenti studio video
│   │   ├── prompt-form.tsx
│   │   └── video-result.tsx
│   ├── ui/               # Componenti UI riutilizzabili
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── icons.tsx
│   │   └── input.tsx
│   └── navbar.tsx        # Navbar con auth
├── lib/
│   └── supabase.ts       # Client Supabase
├── types/
│   ├── index.ts          # Tipi TypeScript
│   └── database.ts       # Tipi Supabase
├── .env.local.example    # Template variabili ambiente
├── next.config.ts
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🚀 Guida Deploy in Produzione

### 1. Setup Repository GitHub

```bash
# Inizializza repository
cd plasmo-ai
git init
git add .
git commit -m "Initial commit"

# Crea repository su GitHub e push
git remote add origin https://github.com/TUO_USERNAME/plasmo-ai.git
git branch -M main
git push -u origin main
```

### 2. Setup Supabase

1. Vai su [https://supabase.com](https://supabase.com) e crea un account
2. Crea un nuovo progetto
3. Vai in **Project Settings > API** e copia:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

4. Vai in **SQL Editor** e esegui queste query:

```sql
-- Tabella profili
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  credits INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella generazioni video
CREATE TABLE video_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  prompt TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  video_url TEXT,
  thumbnail_url TEXT,
  aspect_ratio TEXT DEFAULT '16:9',
  resolution TEXT DEFAULT '720p',
  mode TEXT DEFAULT 'text_to_video',
  credits_used INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella transazioni crediti
CREATE TABLE credit_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  amount INTEGER NOT NULL,
  type TEXT CHECK (type IN ('purchase', 'usage', 'bonus')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: utenti vedono solo i propri dati
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own generations" ON video_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generations" ON video_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- Trigger per creare profilo automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (NEW.id, NEW.email, 8);
  
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 8, 'bonus', 'Crediti benvenuto');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket per i video
INSERT INTO storage.buckets (id, name, public) 
VALUES ('videos', 'videos', true);

-- Policy storage
CREATE POLICY "Users can upload own videos" ON storage.objects
  FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own videos" ON storage.objects
  FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 3. Setup Google AI

1. Vai su [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Crea una nuova API Key
3. Copia la chiave → `GOOGLE_AI_API_KEY`

### 4. Deploy su Vercel

1. Vai su [https://vercel.com](https://vercel.com) e connetti il tuo account GitHub
2. Clicca "Add New Project"
3. Seleziona il repository `plasmo-ai`
4. Configura le **Environment Variables**:

| Nome | Valore |
|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Il tuo Project URL da Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La tua anon key da Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | La tua service_role key da Supabase |
| `GOOGLE_AI_API_KEY` | La tua API key da Google AI Studio |

5. Clicca "Deploy"

### 5. Configura URL Redirect (Importante!)

1. In Supabase, vai in **Authentication > URL Configuration**
2. Imposta:
   - **Site URL**: `https://TUO-DOMAIN.vercel.app`
   - **Redirect URLs**: Aggiungi `https://TUO-DOMAIN.vercel.app/auth/callback`

## 🔧 Variabili Ambiente

Crea un file `.env.local` in locale:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Google AI / Gemini API Key
GOOGLE_AI_API_KEY=AIza...

# App Configuration
NEXT_PUBLIC_APP_NAME=Plasmo AI
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 💻 Sviluppo Locale

```bash
# Installa dipendenze
npm install

# Crea file env
cp .env.local.example .env.local
# Modifica .env.local con le tue chiavi

# Avvia server sviluppo
npm run dev

# Apri http://localhost:3000
```

## 📊 Costi e Crediti

| Risoluzione | Costo Crediti |
|-------------|---------------|
| 720p | 10 crediti |
| 1080p | 15 crediti |
| 4K | 20 crediti |

I nuovi utenti ricevono **8 crediti gratuiti** al primo accesso.

## 📝 Note Importanti

1. **Limite Rate API Google**: L'API Veo ha limiti di utilizzo. Controlla la [documentazione ufficiale](https://ai.google.dev/pricing).

2. **Storage Supabase**: I video generati vengono salvati nel bucket "videos". Configura le policy CORS se necessario.

3. **Timeout**: La generazione video può richiedere diversi minuti. L'API route ha un timeout configurato in `next.config.ts`.

4. **Sicurezza**: La chiave `GOOGLE_AI_API_KEY` è mantenuta solo server-side. Mai esporla nel client!

## 🆘 Troubleshooting

### Errore "Crediti insufficienti"
- Verifica che l'utente abbia crediti > 0 nella tabella `profiles`
- Controlla che il trigger `on_auth_user_created` sia attivo

### Errore "API key non valida"
- Verifica che `GOOGLE_AI_API_KEY` sia corretta in Vercel
- Assicurati di aver abilitato l'API Veo nel Google Cloud Console

### Video non si genera
- Controlla i log in Vercel (Functions tab)
- Verifica che il modello `veo-3.1-generate-preview` sia accessibile

### Errore CORS
- In Supabase Storage, verifica che il bucket "videos" sia public
- Controlla le policies di storage

## 📄 Licenza

MIT License - Sentiti libero di usare e modificare questo progetto!

---

Fatto con ❤️ in Italia 🇮🇹
