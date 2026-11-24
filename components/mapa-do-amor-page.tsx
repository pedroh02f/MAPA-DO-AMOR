import Image from 'next/image'

const KIWIFY_CHECKOUT_URL = 'https://pay.kiwify.com.br/xy7oOc7'
import {
  ArrowDown,
  ArrowRight,
  Check,
  ChevronDown,
  Compass,
  Heart,
  Moon,
  Sparkles,
  Star,
  Stars,
} from 'lucide-react'

const discoveries = [
  {
    number: '01',
    title: 'Seu perfil afetivo',
    description: 'Um retrato acolhedor da forma como você se conecta, cuida e expressa o que sente.',
    icon: Heart,
  },
  {
    number: '02',
    title: 'Padrões que se repetem',
    description: 'Um convite para reconhecer hábitos nos relacionamentos e abrir espaço para novas escolhas.',
    icon: Compass,
  },
  {
    number: '03',
    title: 'Compatibilidade emocional',
    description: 'Perceba quais necessidades, valores e formas de comunicação são importantes para você.',
    icon: Stars,
  },
  {
    number: '04',
    title: 'Símbolos de astrologia e numerologia',
    description: 'Interpretações simbólicas para enriquecer sua reflexão — sem previsões ou certezas.',
    icon: Moon,
  },
  {
    number: '05',
    title: 'Exercícios de autoconhecimento',
    description: 'Perguntas e práticas simples para escutar seus desejos com mais clareza e gentileza.',
    icon: Sparkles,
  },
  {
    number: '06',
    title: 'Um plano de 30 dias',
    description: 'Pequenos passos para transformar as descobertas em atitudes possíveis no seu cotidiano.',
    icon: Check,
  },
]

const steps = [
  {
    number: '01',
    title: 'Responda ao quiz',
    description: 'Compartilhe suas percepções sobre a vida amorosa em um questionário guiado.',
  },
  {
    number: '02',
    title: 'Conheça uma prévia',
    description: 'Receba um primeiro vislumbre do seu perfil afetivo e das reflexões que o acompanham.',
  },
  {
    number: '03',
    title: 'Acesse o guia completo',
    description: 'Se desejar, adquira o e-book completo — o mesmo guia para todas as leitoras.',
  },
]

const faqs = [
  {
    question: 'O Mapa do Amor prevê o futuro ou diz quem é minha alma gêmea?',
    answer:
      'Não. O Mapa do Amor é um material de reflexão e autoconhecimento. Ele não prevê o futuro, não identifica uma pessoa específica e não garante que um relacionamento vá acontecer.',
  },
  {
    question: 'Como recebo o meu Mapa do Amor?',
    answer:
      'Você responde ao quiz e recebe uma prévia gratuita baseada nas respostas. Se decidir comprar, será direcionada ao checkout da Kiwify, que entrega o mesmo e-book completo a todas as compradoras, após a confirmação do pagamento.',
  },
  {
    question: 'Preciso ter conhecimento de astrologia ou numerologia?',
    answer:
      'Não. As interpretações simbólicas serão apresentadas de forma acessível e usadas como apoio à reflexão — nunca como diagnóstico ou verdade absoluta.',
  },
  {
    question: 'O conteúdo substitui terapia ou aconselhamento profissional?',
    answer:
      'Não. É um recurso educativo de autoconhecimento e não substitui acompanhamento psicológico, terapêutico ou qualquer orientação profissional.',
  },
]

function PurchaseButton({ prominent = false }: { prominent?: boolean }) {
  return (
    <div className={prominent ? 'cta-wrap cta-wrap-prominent' : 'cta-wrap'}>
      <a
        className={prominent ? 'button button-gold' : 'button button-outline'}
        href={KIWIFY_CHECKOUT_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Comprar Mapa do Amor — R$ 22,90 na Kiwify"
      >
        Quero meu Mapa do Amor
        <ArrowRight aria-hidden="true" />
      </a>
    </div>
  )
}

function BrandMark() {
  return (
    <a className="brand" href="#inicio" aria-label="Mapa do Amor — início">
      <span className="brand-icon" aria-hidden="true">
        <Moon />
        <span className="brand-spark"><Sparkles aria-hidden="true" /></span>
      </span>
      <span className="brand-name">Mapa <span>do Amor</span></span>
    </a>
  )
}

function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <BrandMark />
        <nav className="main-nav" aria-label="Navegação principal">
          <a href="#jornada">A jornada</a>
          <a href="#descobertas">O que você descobre</a>
          <a href="#duvidas">Dúvidas</a>
        </nav>
        <a className="header-link" href="#oferta">
          Conheça o relatório <ArrowRight aria-hidden="true" />
        </a>
      </div>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="hero-section" id="inicio" aria-labelledby="hero-title">
      <div className="hero-stars hero-stars-one" aria-hidden="true"><Sparkles aria-hidden="true" /></div>
      <div className="hero-stars hero-stars-two" aria-hidden="true"><Star aria-hidden="true" /></div>
      <div className="hero-stars hero-stars-three" aria-hidden="true"><Sparkles /></div>
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow"><span /> UM ENCONTRO COM VOCÊ</p>
          <h1 id="hero-title">Descubra o seu <em>Mapa do Amor</em></h1>
          <p className="hero-lede">
            Uma jornada de autoconhecimento para compreender sua maneira de amar,
            reconhecer padrões e construir relações mais conscientes.
          </p>
          <div className="hero-actions">
            <PurchaseButton prominent />
            <a className="text-link" href="#jornada">Conheça a jornada <ArrowDown aria-hidden="true" /></a>
          </div>
          <div className="hero-note">
            <span className="note-icon"><Sparkles aria-hidden="true" /></span>
            <p>Um olhar mais gentil para a sua história afetiva — no seu tempo.</p>
          </div>
        </div>
        <div className="hero-art" aria-label="Arte inspirada em símbolos celestiais e autoconhecimento">
          <div className="art-halo" aria-hidden="true" />
          <div className="hero-image-frame">
            <Image
              src="/mapa-do-amor-celestial.png"
              alt="Composição artística com astrolábio dourado, lua crescente e uma rosa sobre veludo vinho"
              fill
              priority
              sizes="(max-width: 760px) 88vw, 45vw"
              className="hero-image"
            />
            <div className="art-caption">
              <span className="caption-star" aria-hidden="true"><Sparkles aria-hidden="true" /></span>
              <span>Um mapa para olhar para dentro</span>
            </div>
          </div>
          <div className="floating-seal" aria-hidden="true">
            <span>UMA JORNADA</span>
            <Moon />
            <span>PARA SI</span>
          </div>
          <span className="art-star art-star-a" aria-hidden="true"><Star aria-hidden="true" /></span>
          <span className="art-star art-star-b" aria-hidden="true"><Sparkles aria-hidden="true" /></span>
        </div>
      </div>
      <div className="hero-bottom-line" aria-hidden="true"><span /></div>
    </section>
  )
}

function IntroSection() {
  return (
    <section className="intro-section" id="jornada" aria-labelledby="intro-title">
      <div className="section-kicker"><span /> UMA LEITURA FEITA PARA VOCÊ <span /></div>
      <div className="intro-grid">
        <div>
          <p className="eyebrow eyebrow-dark">MAIS CLAREZA, MAIS ESCOLHA</p>
          <h2 id="intro-title">Sua história merece ser <em>compreendida</em>, não julgada.</h2>
        </div>
        <div className="intro-copy">
          <p>
            O Mapa do Amor começa com um quiz gratuito que apresenta uma prévia baseada nas suas respostas.
            O produto pago é um e-book completo, igual para todas as compradoras, com orientações
            para consultar conforme seu signo e suas necessidades.
          </p>
          <p>
            Com acolhimento e curiosidade, ele reúne percepções práticas e interpretações
            simbólicas para ajudar você a enxergar possibilidades — sem fórmulas prontas.
          </p>
          <a className="dark-text-link" href="#descobertas">O que você vai encontrar <ArrowRight aria-hidden="true" /></a>
        </div>
      </div>
      <div className="intro-ornament" aria-hidden="true"><span><Sparkles aria-hidden="true" /></span><i /><span><Star aria-hidden="true" /></span><i /><span><Sparkles aria-hidden="true" /></span></div>
    </section>
  )
}

function DiscoveriesSection() {
  return (
    <section className="discoveries-section" id="descobertas" aria-labelledby="discoveries-title">
      <div className="discoveries-heading">
        <div>
          <p className="eyebrow"><span /> SEU UNIVERSO INTERIOR</p>
          <h2 id="discoveries-title">O que você vai <em>descobrir</em></h2>
        </div>
        <p className="discoveries-summary">
          Cada capítulo do e-book é um convite a se conhecer melhor e escolher com mais intenção.
        </p>
      </div>
      <div className="discovery-grid">
        {discoveries.map(({ number, title, description, icon: Icon }) => (
          <article className="discovery-card" key={number}>
            <div className="discovery-topline">
              <span className="discovery-number">{number}</span>
              <span className="discovery-icon"><Icon aria-hidden="true" /></span>
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
          </article>
        ))}
      </div>
      <p className="symbolic-note"><Sparkles aria-hidden="true" /> Astrologia e numerologia aparecem como linguagens simbólicas, não como previsões.</p>
    </section>
  )
}

function ProcessSection() {
  return (
    <section className="process-section" aria-labelledby="process-title">
      <div className="process-heading">
        <p className="eyebrow eyebrow-dark">SIMPLES, NO SEU TEMPO</p>
        <h2 id="process-title">Como funciona <em>a jornada</em></h2>
        <p>Um caminho em três passos, da curiosidade a novas possibilidades.</p>
      </div>
      <div className="steps-grid">
        {steps.map((step, index) => (
          <article className="step-card" key={step.number}>
            <div className="step-number-row">
              <span className="step-number">{step.number}</span>
              {index < steps.length - 1 && <span className="step-connector" aria-hidden="true" />}
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </article>
        ))}
      </div>
      <p className="availability-note"><Moon aria-hidden="true" /> A prévia é gratuita. O e-book completo é vendido separadamente pela Kiwify.</p>
    </section>
  )
}

function OfferSection() {
  return (
    <section className="offer-section" id="oferta" aria-labelledby="offer-title">
      <div className="offer-glow" aria-hidden="true" />
      <div className="offer-decoration" aria-hidden="true"><Stars /><span><Star aria-hidden="true" /></span><i /></div>
      <div className="offer-content">
        <p className="eyebrow"><span /> UM CONVITE AO AUTOCONHECIMENTO</p>
        <h2 id="offer-title">Um novo olhar sobre<br />o seu <em>jeito de amar.</em></h2>
        <p className="offer-description">Um e-book digital completo, com signos, numerologia e um plano prático de 30 dias.</p>
        <div className="offer-card">
          <div className="offer-price-row">
            <span className="price-label">Acesso ao e-book completo</span>
            <div className="price"><span>R$</span> 22,90</div>
          </div>
          <div className="offer-divider" />
          <ul className="offer-includes">
            <li><Check aria-hidden="true" /> Pagamento único</li>
            <li><Check aria-hidden="true" /> Produto 100% digital</li>
            <li><Check aria-hidden="true" /> Guia completo para consulta</li>
          </ul>
          <PurchaseButton prominent />
          <p className="offer-footnote">Pagamento seguro no checkout da Kiwify. E-book único para todas as compradoras.</p>
        </div>
        <p className="offer-reassurance"><Heart aria-hidden="true" /> Sem promessas de futuro. Um espaço para se escutar melhor.</p>
      </div>
    </section>
  )
}

function FaqSection() {
  return (
    <section className="faq-section" id="duvidas" aria-labelledby="faq-title">
      <div className="faq-heading">
        <p className="eyebrow eyebrow-dark">TUDO COM TRANSPARÊNCIA</p>
        <h2 id="faq-title">Perguntas <em>frequentes</em></h2>
        <p>Um pouco mais sobre o Mapa do Amor e a experiência.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details className="faq-item" key={faq.question} open={index === 0}>
            <summary>
              <span>{faq.question}</span>
              <ChevronDown aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
      <div className="faq-bottom-note">
        <span aria-hidden="true"><Sparkles aria-hidden="true" /></span>
        <p>Uma ferramenta de reflexão; suas escolhas continuam sendo suas.</p>
        <span aria-hidden="true"><Sparkles aria-hidden="true" /></span>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-main">
        <div className="footer-brand-block">
          <BrandMark />
          <p>Autoconhecimento amoroso, com acolhimento e intenção.</p>
        </div>
        <div className="footer-links">
          <p className="footer-label">INFORMAÇÕES</p>
          <a href="#politica-de-privacidade">Política de Privacidade</a>
          <a href="#termos-de-uso">Termos de Uso</a>
        </div>
        <div className="footer-product">
          <p className="footer-label">SOBRE O PRODUTO</p>
          <p>E-book digital de autoconhecimento amoroso, igual para todas as compradoras.</p>
          <p>Valor apresentado: R$ 22,90 · pagamento único.</p>
        </div>
      </div>
      <div className="footer-legal" aria-label="Informações legais">
        <section id="politica-de-privacidade">
          <h2>Política de Privacidade</h2>
          <p>Esta página de apresentação não coleta informações diretamente. O quiz vinculado coleta informações para a prévia e possui aviso de privacidade próprio. O checkout da Kiwify possui seus próprios termos e políticas. Complete o aviso com os dados do responsável antes de publicar comercialmente.</p>
        </section>
        <section id="termos-de-uso">
          <h2>Termos de Uso</h2>
          <p>O conteúdo é destinado ao autoconhecimento e não oferece previsões, garantias de relacionamento, diagnóstico ou substituição de acompanhamento profissional.</p>
        </section>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Mapa do Amor</span>
        <span>Feito para olhar para dentro <span aria-hidden="true"><Sparkles aria-hidden="true" /></span></span>
      </div>
    </footer>
  )
}

export default function MapaDoAmorPage() {
  return (
    <main className="love-page">
      <Header />
      <HeroSection />
      <IntroSection />
      <DiscoveriesSection />
      <ProcessSection />
      <OfferSection />
      <FaqSection />
      <Footer />
    </main>
  )
}
