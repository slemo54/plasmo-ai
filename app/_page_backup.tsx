import Link from 'next/link'
import {
  Sparkles,
  Zap,
  Video,
  Wand2,
  ArrowRight,
  Play,
  Star,
  CheckCircle,
} from '@/components/ui/icons'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const features = [
    {
      icon: Wand2,
      title: 'Testo in Video',
      description: 'Descrivi la tua idea e trasformala in un video cinematografico in pochi minuti.',
    },
    {
      icon: Video,
      title: 'Fotogrammi Chiave',
      description: 'Carica il frame iniziale e finale, lascia che l\'AI generi il video tra di essi.',
    },
    {
      icon: Zap,
      title: 'Ultra Veloce',
      description: 'Tecnologia Veo 3.1 di Google per generazioni rapide e di alta qualità.',
    },
  ]

  const testimonials = [
    {
      name: 'Marco Rossi',
      role: 'Content Creator',
      content: 'Plasmo AI ha rivoluzionato il mio workflow. Genero video per i miei social in pochi minuti!',
      rating: 5,
    },
    {
      name: 'Laura Bianchi',
      role: 'Marketing Manager',
      content: 'Qualità cinematografica incredibile. I nostri clienti restano sempre impressionati.',
      rating: 5,
    },
    {
      name: 'Giuseppe Verdi',
      role: 'Filmmaker Indie',
      content: 'Lo uso per i storyboard e le prove di scena. Risparmio ore di lavoro.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-[#090a0f]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800/50 bg-[#090a0f]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
              P
            </div>
            <span className="text-xl font-bold text-white">Plasmo AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Accedi
            </Link>
            <Link href="/login">
              <Button size="sm">Inizia Gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 border border-blue-600/20 rounded-full mb-8">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-blue-400">Powered by Gemini Veo 3.1</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Crea Video{' '}
            <span className="gradient-text">Cinematografici</span>
            <br />
            con l&apos;Intelligenza Artificiale
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Trasforma le tue idee in video mozzafiato. Descrivi, carica o seleziona 
            e lascia che l&apos;AI faccia la magia. Qualità professionale in pochi click.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Prova Gratuitamente
              </Button>
            </Link>
            <button className="flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors">
              <Play className="w-5 h-5" />
              <span>Guarda la Demo</span>
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 pt-8 border-t border-gray-800">
            {[
              { value: '10K+', label: 'Video Creati' },
              { value: '4.9/5', label: 'Valutazione' },
              { value: '< 2min', label: 'Per Video' },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 bg-[#0b0c14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Tutto ciò che ti serve per creare
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Strumenti professionali per ogni esigenza creativa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="p-8 bg-[#111218] border border-gray-800 rounded-2xl hover:border-gray-700 transition-colors group"
              >
                <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Prezzi Semplici e Trasparenti
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Inizia gratis, scala quando ne hai bisogno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: 'Gratis',
                credits: 8,
                features: ['8 crediti di benvenuto', '720p risoluzione', 'Supporto email'],
                cta: 'Inizia Gratis',
                popular: false,
              },
              {
                name: 'Pro',
                price: '€19',
                period: '/mese',
                credits: 100,
                features: ['100 crediti/mese', 'Fino a 4K', 'Priorità nella coda', 'Supporto prioritario'],
                cta: 'Scegli Pro',
                popular: true,
              },
              {
                name: 'Business',
                price: '€49',
                period: '/mese',
                credits: 300,
                features: ['300 crediti/mese', 'Fino a 4K', 'API access', 'Supporto dedicato'],
                cta: 'Contattaci',
                popular: false,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`p-8 rounded-2xl border ${
                  plan.popular
                    ? 'bg-blue-600/5 border-blue-500/30 relative'
                    : 'bg-[#111218] border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                      Più Popolare
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 ml-1">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-400 mb-6">{plan.credits} crediti inclusi</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/login" className="block">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-[#0b0c14]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Cosa dicono i nostri utenti
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="p-6 bg-[#111218] border border-gray-800 rounded-2xl"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-gray-300 mb-4">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-3xl">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Pronto a creare il tuo primo video?
            </h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Unisciti a migliaia di creativi che usano Plasmo AI per portare le loro idee alla vita.
            </p>
            <Link href="/login">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Inizia Gratuitamente
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-lg">
                P
              </div>
              <span className="text-xl font-bold">Plasmo AI</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="#" className="hover:text-gray-300 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Termini</Link>
              <Link href="#" className="hover:text-gray-300 transition-colors">Supporto</Link>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 Plasmo AI. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
