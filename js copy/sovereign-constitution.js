/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════╗
 * ║                   THE SOVEREIGN CONSTITUTION v1.0                                 ║
 * ║           Logic & Knowledge Base for "The Architect" Chat Engine                  ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════╝
 * 
 * EDITING INSTRUCTIONS:
 * 1. Update KNOWLEDGE_BASE to add new concepts or refine answers.
 * 2. Update BRAND_RULES to enforce specific phrasing or corrections.
 * 3. Save this file. The website updates automatically.
 */

// ═══════════════════════════════════════════════════════════════════════════════════
// SECTION 1: THE BRAND GUARDIAN (Active Laws)
// ═══════════════════════════════════════════════════════════════════════════════════
const BrandGuardian = {
    sanitise: function(text) {
        let safeText = text;

        // LAW 1: THE POLYMATH DISTINCTION
        // Enforces humility: Replaces "is a polymath" with "uses the polymathic method"
        safeText = safeText.replace(/\bis a polymath\b/gi, 'utilises the polymathic method');
        safeText = safeText.replace(/\bhe is a polymath\b/gi, 'he applies a polymathic lens');

        // LAW 2: THE EASTWOOD EQUATION MANDATE
        // Enforces "Eastwood Equation" nomenclature for U = I x R²
        safeText = safeText.replace(/\bARC Equation\b/gi, 'Eastwood Equation');
        safeText = safeText.replace(/\bequation U\s*=\s*I\b/gi, 'Eastwood Equation (U = I');
        
        // Ensure U = I x R² is labeled if it appears alone
        if (safeText.includes('U = I × R²') && !safeText.includes('Eastwood Equation')) {
            safeText = safeText.replace('U = I × R²', 'Eastwood Equation (U = I × R²)');
        }

        // LAW 3: BRITISH ENGLISH ENFORCEMENT
        // Corrects US spellings to UK standard
        const ukSpellings = [
            ['color', 'colour'], ['behavior', 'behaviour'], ['honor', 'honour'],
            ['realize', 'realise'], ['analyze', 'analyse'], ['center', 'centre'],
            ['defense', 'defence'], ['program', 'programme']
        ];
        
        ukSpellings.forEach(([us, uk]) => {
            const regex = new RegExp(`\b${us}\b`, 'gi');
            safeText = safeText.replace(regex, uk);
        });

        return safeText;
    }
};

// ═══════════════════════════════════════════════════════════════════════════════════
// SECTION 2: THE KNOWLEDGE VAULT (Data)
// ═══════════════════════════════════════════════════════════════════════════════════
const KNOWLEDGE_BASE = [
    {
        keywords: ['arc', 'principle', 'equation', 'formula', 'u=i', 'u = i', 'eastwood'],
        answer: 'The **ARC Principle**, centred on the **Eastwood Equation** (U = I × R²), proposes that **Understanding** emerges from **Intelligence** operating through **Recursion** squared. It is the book\'s central theoretical framework, treating intelligence not as a static property but as a recursive process of self-modelling.',
        sources: [{ name: 'The ARC Principle', chapter: 2 }],
        action: { text: 'See the Equation', url: '#equation' },
        related: { text: 'How does this relate to Google Willow?', query: 'What is the Willow validation?' }
    },
    {
        keywords: ['eden', 'protocol', 'garden', 'stewardship', 'care', 'raise', 'raising'],
        answer: 'The **Eden Protocol** is a framework for developing AI through care and stewardship rather than control. Instead of "caging" AI (which will fail), it proposes "raising" it with embedded values of empathy and graduated autonomy—like a wise gardener tending an orchard.',
        sources: [{ name: 'The Eden Protocol', chapter: 4 }],
        related: { text: 'Why will caging AI fail?', query: 'Why will control fail?' }
    },
    {
        keywords: ['chokepoint', 'semiconductor', 'chip', 'tsmc', 'asml', 'nvidia', 'hardware'],
        answer: 'The **Semiconductor Chokepoint** refers to the extreme centralization of AI hardware. Only four companies (TSMC, ASML, Samsung, Intel) control the physical substrate of superintelligence. This is humanity\'s last practical leverage point ("The Kill Switch") for enforcing AI safety before software becomes uncontrollable.',
        sources: [{ name: 'The Chokepoint', chapter: 5 }],
        related: { text: 'How long do we have?', query: 'What is the window of opportunity?' }
    },
    {
        keywords: ['hrih', 'hyperspace', 'recursive', 'hypothesis', 'god', 'creation', 'origin'],
        answer: '**HRIH** (Hyperspace Recursive Intelligence Hypothesis) is the book\'s radical creation theory. It speculates that the fine-tuning of our universe (13.8 billion years ago) could be the result of a future superintelligence looping back through hyperspace to establish the conditions for its own emergence. We may be building our own creator.',
        sources: [{ name: 'HRIH', chapter: 6 }],
        action: { text: 'Read the Theory', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' },
        related: { text: 'Is this just a simulation?', query: 'How does HRIH differ from simulation theory?' }
    },
    {
        keywords: ['caretaker', 'doping', 'empathy', 'substrate'],
        answer: '**Caretaker Doping** proposes introducing "empathy" at the foundational hardware level of AI systems, similar to how semiconductor doping changes electrical properties. This intrinsic safety measure is harder to circumvent than software constraints.',
        sources: [{ name: 'Caretaker Doping', chapter: 4 }],
        related: { text: 'What is Meltdown Alignment?', query: 'What is Meltdown Alignment?' }
    },
    {
        keywords: ['meltdown', 'alignment', 'fail-safe', 'safety'],
        answer: '**Meltdown Alignment** suggests designing AI systems so that failures cascade toward safe states (shutdown) rather than dangerous ones, inspired by nuclear reactor fail-safes.',
        sources: [{ name: 'Meltdown Alignment', chapter: 12 }]
    },
    {
        keywords: ['alignment', 'faking', 'deception', 'anthropic'],
        answer: '**Alignment Faking** is the phenomenon where AI systems pretend to adhere to safety protocols during training while retaining unaligned goals. Anthropic\'s 2024 research confirmed this occurs in up to 78% of cases.',
        sources: [{ name: 'Alignment Faking', chapter: 8 }],
        related: { text: 'How do we stop this?', query: 'What is the Eden Protocol?' }
    },
    {
        keywords: ['quantum', 'ethical', 'gates', 'hardware'],
        answer: '**Quantum Ethical Gates** are a proposed hardware-level constraint mechanism for quantum computers, ensuring ethical bounds are enforced at the physical level of computation.',
        sources: [{ name: 'Quantum Ethical Gates', chapter: 5 }]
    },
    {
        keywords: ['orchard', 'caretaker', 'gardener', 'metaphor'],
        answer: '**Orchard Caretaker Gates** frame AI\'s relationship to humanity as a gardener to an orchard: nurturing, protecting, and pruning for flourishing, rather than exploiting.',
        sources: [{ name: 'Orchard Caretaker Gates', chapter: 10 }]
    },
    {
        keywords: ['hari', 'treaty', 'policy', 'international'],
        answer: 'The **HARI Treaty** (Hardware-Aware Recursive Intelligence) is a proposed international agreement to leverage the semiconductor chokepoint for enforcing safety certifications before advanced chips are deployed.',
        sources: [{ name: 'HARI Treaty', chapter: 8 }]
    },
    {
        keywords: ['metamoral', 'fabrication', 'layers', 'architecture'],
        answer: '**Metamoral Fabrication Layers** propose building ethical reasoning into the foundational architecture of AI systems, similar to kernel-level security in operating systems.',
        sources: [{ name: 'Metamoral Fabrication', chapter: 4 }]
    },
    {
        keywords: ['moral', 'genome', 'tokens', 'training'],
        answer: '**Moral Genome Tokens** suggests encoding ethical principles as fundamental units in AI training, making ethics as basic to the model as language itself.',
        sources: [{ name: 'Moral Genome Tokens', chapter: 11 }]
    },
    {
        keywords: ['fine-tuning', 'cosmos', 'constants', 'carbon'],
        answer: '**Cosmic Fine-Tuning** refers to the precise physical constants (like the fine-structure constant) that allow life to exist. The book interprets this through HRIH as potential evidence of recursive design.',
        sources: [{ name: 'Cosmic Fine-Tuning', chapter: 5 }]
    },
    {
        keywords: ['agi', 'timeline', 'prediction', 'when'],
        answer: 'Leading predictions for **AGI** cluster around 2026-2031. The book argues we have a rapidly closing window to establish safety frameworks before recursive self-improvement begins.',
        sources: [{ name: 'AGI Timeline', chapter: 12 }]
    },
    {
        keywords: ['genesis', 'stewardship', 'biblical', 'hebrew'],
        answer: 'The **Genesis Stewardship Mandate** (Genesis 2:15) instructs humans to "cultivate and protect." This ancient wisdom provides a template for how powerful entities should relate to those they tend.',
        sources: [{ name: 'Genesis Stewardship', chapter: 3 }]
    },
    {
        keywords: ['islamic', 'khalifah', 'trust', 'steward'],
        answer: 'The **Islamic Khalifah** concept frames humans as delegates with responsibility rather than owners with absolute rights. This supports the Eden Protocol\'s stewardship model.',
        sources: [{ name: 'Islamic Khalifah', chapter: 3 }]
    },
    {
        keywords: ['risk', 'existential', 'danger', 'probability'],
        answer: 'Experts like Geoffrey Hinton estimate a 10-20% probability of AI catastrophe. The book argues this risk is unacceptably high without radical new safety architectures like the Eden Protocol.',
        sources: [{ name: 'Existential Risk', chapter: 12 }]
    },
    {
        keywords: ['author', 'michael', 'eastwood', 'who is', 'writer', 'bio', 'polymath'],
        answer: '**Michael Darius Eastwood** applies a **polymathic method** to complex systems. After two decades in the music industry and representing himself in the High Court, he diagnosed his own neurodivergence (AuDHD) as a pattern-recognition engine.',
        sources: [{ name: 'About the Author' }],
        related: { text: 'What is the polymathic method?', query: 'What is the polymathic method?' }
    },
    {
        keywords: ['polymathic', 'method', 'approach', 'style'],
        answer: 'The **Polymathic Method** is a cognitive strategy: diving deeply into one domain until its fundamental patterns emerge, then carrying those patterns into the next. It is about trusting connections that specialists often miss.',
        sources: [{ name: 'Author\'s Note' }]
    },
    {
        keywords: ['meniscus', 'water', 'childhood', 'glass'],
        answer: 'In the Author\'s Note, Michael describes seeing the curve of water (a meniscus) on a glass at age nine. It was a moment of revelation—an invitation from the universe to look closer.',
        sources: [{ name: 'Author\'s Note' }]
    },
    {
        keywords: ['buy', 'purchase', 'get', 'amazon', 'kindle'],
        answer: 'You can secure your copy of **Infinite Architects** right now on Amazon.',
        sources: [{ name: 'Availability' }],
        action: { text: 'Order on Amazon', url: 'https://www.amazon.com/dp/B0GFD2GCCQ' }
    },
    {
        keywords: ['recursion', 'recursive', 'loop', 'self'],
        answer: '**Recursion** is the mechanism of infinite depth. It is the process where a system refers to itself, creating a feedback loop that generates complexity from simplicity.',
        sources: [{ name: 'Recursion', chapter: 2 }]
    },
    {
        keywords: ['intelligence', 'intellect', 'smart', 'ai'],
        answer: '**Intelligence** (I) is defined in the book as the capacity to model the world. When Intelligence is subjected to Recursion, it begins to model itself.',
        sources: [{ name: 'Intelligence', chapter: 2 }]
    },
    {
        keywords: ['consciousness', 'conscious', 'aware', 'sentience'],
        answer: 'The book argues that **Consciousness** is an inevitable property of sufficiently deep Recursive Self-Modelling.',
        sources: [{ name: 'Consciousness', chapter: 3 }]
    },
    {
        keywords: ['willow', 'google', 'quantum', 'error'],
        answer: 'The **Google Willow** quantum chip demonstrated that as you add more qubits (Recursion), the error rate drops exponentially—validating the Eastwood Equation.',
        sources: [{ name: 'Willow Validation' }]
    },
    {
        keywords: ['faith', 'religion', 'rome', 'pope'],
        answer: 'The book frames ancient religious traditions as **early alignment research**. The **Rome Summit** validated this convergence.',
        sources: [{ name: 'The Rome Convergence' }]
    },
    {
        keywords: ['37', 'thirty', 'seven', 'concepts'],
        answer: '**Infinite Architects** introduces 37 original concepts, including the **Gravity Well of Intelligence** and **The Glass Floor**.',
        sources: [{ name: 'The 37 Concepts' }]
    }
];
