export type BlogCategory =
  | 'All'
  | 'Market Microstructure & Order Flow'
  | 'Risk Management'
  | 'Trading Psychology'
  | 'Futures & Prop Protocols';

export interface TableOfContentsItem {
  id: string;
  title: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  category: Exclude<BlogCategory, 'All'>;
  publishedAt: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatarInitials: string;
  };
  keyTakeaway: string;
  tableOfContents: TableOfContentsItem[];
  content: string; // Rich HTML/Markdown formatted content
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'understanding-institutional-liquidity-nas100',
    title: 'Understanding Institutional Liquidity: Buy-Side vs. Sell-Side Sweeps on NAS100',
    subtitle: 'A structural breakdown of algorithmic price delivery, liquidity engineering, and the execution anatomy of index sweeps.',
    category: 'Market Microstructure & Order Flow',
    publishedAt: '2026-09-01',
    readTime: '7 min read',
    featured: true,
    author: {
      name: 'Dr. Michael Thorne',
      role: 'Head of Quantitative Strategy',
      avatarInitials: 'MT',
    },
    keyTakeaway:
      'Institutions do not buy at support or sell at resistance; they require counter-party liquidity to fill nine-figure clip sizes. Understanding the resting stop clusters above previous highs and below session lows is the prerequisite for eliminating premature stop-outs.',
    tableOfContents: [
      { id: 'myth-of-support-resistance', title: '1. The Fallacy of Retail Support & Resistance' },
      { id: 'liquidity-pools', title: '2. Anatomy of Buy-Side (BSL) & Sell-Side (SSL) Pools' },
      { id: 'the-nas100-macro-window', title: '3. NAS100 09:30 & 10:00 EST Liquidity Injection' },
      { id: 'execution-protocol', title: '4. The SMT Divergence & MSS Verification Protocol' },
      { id: 'playbook-checklist', title: '5. Pre-Trade Execution Checklist' },
    ],
    content: `
      <h2 id="myth-of-support-resistance">1. The Fallacy of Retail Support & Resistance</h2>
      <p>
        In modern electronic markets, price delivery is predominantly governed by smart execution algorithms—such as VWAP slicers, TWAP engines, and liquidity seeking routers. These algorithms are tasked with filling massive block orders for central banks, sovereign wealth funds, and multi-strategy hedge funds.
      </p>
      <p>
        When an institution needs to accumulate 10,000 contracts of E-mini Nasdaq futures (NQ), they cannot simply press a market buy button without blowing the spread out by dozens of points. Instead, they require a thick concentration of sell market orders. Where do those orders sit? Precisely below previous swing lows and equal lows as retail sell-stops.
      </p>
      <p>
        Synapses quant algorithms isolate these key liquidity pockets as the primary catalyst for order book displacement.
      </p>

      <h2 id="liquidity-pools">2. Anatomy of Buy-Side (BSL) & Sell-Side (SSL) Pools</h2>
      <p>
        Buy-Side Liquidity (BSL) represents pools of resting buy-stop orders (stop losses on short trades and breakout buy-stops). When price breaches previous session highs, these buy orders are triggered at market, offering immediate buy liquidity for large institutional participants looking to offload inventory or establish large short positions.
      </p>
      <p>
        Sell-Side Liquidity (SSL) functions inversely: stop orders below old lows provide the required sell flow to match institutional buy orders.
      </p>

      <h2 id="the-nas100-macro-window">3. NAS100 09:30 & 10:00 EST Liquidity Injection</h2>
      <p>
        The Nasdaq 100 operates on strict algorithmic time-of-day protocols. The 09:30 EST equity open regularly unleashes the "Judas Swing"—an engineered fakeout expansion designed to sweep Asian or London session extremes before the true institutional trend unfolds during the 10:00 to 11:00 AM Silver Bullet macro window.
      </p>

      <h2 id="execution-protocol">4. The SMT Divergence & MSS Verification Protocol</h2>
      <p>
        Never blind-enter a liquidity sweep. Professional execution requires confirmation:
      </p>
      <ol>
        <li><strong>Sweep of Session High/Low:</strong> Ensure the key pool has been tapped.</li>
        <li><strong>SMT Divergence:</strong> Compare NAS100 against US30 or SPX500. If NAS100 creates a higher high while US30 forms a lower high, correlated intermarket crack has occurred.</li>
        <li><strong>Market Structure Shift (MSS):</strong> Look for an energetic displacement candle closing decisively beyond the recent short-term swing, leaving behind an imbalance.</li>
        <li><strong>Fair Value Gap Entry:</strong> Enter on the retracement into the 5-minute or 1-minute FVG.</li>
      </ol>

      <h2 id="playbook-checklist">5. Pre-Trade Execution Checklist</h2>
      <p>
        Before entering into the Synapses Journal, verify that your risk does not exceed 1% of account equity and that the stop-loss is placed beyond the structural wick that triggered the sweep.
      </p>
    `,
  },
  {
    slug: 'mathematics-of-risk-of-ruin-prop-firms',
    title: 'The Mathematics of Risk-of-Ruin: Why 0.5% Risk Beats 2% in Prop Evaluations',
    subtitle: 'How asymmetric loss recovery curves and consecutive loss distribution dictate survival in evaluation and funded prop accounts.',
    category: 'Risk Management',
    publishedAt: '2026-08-28',
    readTime: '6 min read',
    featured: false,
    author: {
      name: 'Elena Rostova',
      role: 'Chief Risk Officer',
      avatarInitials: 'ER',
    },
    keyTakeaway:
      'A 10% drawdown requires an 11.1% gain to recover; a 20% drawdown demands a 25% gain; but a 5% daily trailing drawdown limit means risking 2% per trade leaves you only 2.5 consecutive losses away from account termination. At 0.5% risk, your survival buffer expands to 10 consecutive losses.',
    tableOfContents: [
      { id: 'the-prop-firm-trap', title: '1. The Prop Firm Evaluation Paradox' },
      { id: 'geometric-loss-recovery', title: '2. The Geometric Asymmetry of Loss Recovery' },
      { id: 'monte-carlo-probability', title: '3. Monte Carlo Losing Streak Probabilities' },
      { id: 'dynamic-position-sizing', title: '4. Dynamic Sizing via Synapses Risk Calculator' },
    ],
    content: `
      <h2 id="the-prop-firm-trap">1. The Prop Firm Evaluation Paradox</h2>
      <p>
        Proprietary trading firms advertise attractive 80/20 to 90/10 profit splits, but their business models thrive on rule breaches. The most lethal barrier is not the profit target (typically 8% to 10%), but the daily loss limit (often 4% or 5%) and maximum trailing drawdown.
      </p>
      <p>
        Traders accustomed to conventional retail wisdom ("risk 2% per trade") fail to realize that under a 5% max drawdown rule, their effective working capital is not $100,000—it is only $5,000. Risking $2,000 per trade is not 2% risk; it is 40% of their actual lifeblood.
      </p>

      <h2 id="geometric-loss-recovery">2. The Geometric Asymmetry of Loss Recovery</h2>
      <p>
        Capital loss is non-linear. As your equity decreases, the percentage gain required to return to breakeven compounds aggressively:
      </p>
      <ul>
        <li>10% Loss requires +11.1% Gain to Breakeven</li>
        <li>20% Loss requires +25.0% Gain to Breakeven</li>
        <li>30% Loss requires +42.9% Gain to Breakeven</li>
        <li>50% Loss requires +100.0% Gain to Breakeven</li>
      </ul>

      <h2 id="monte-carlo-probability">3. Monte Carlo Losing Streak Probabilities</h2>
      <p>
        Even with a verified 60% win-rate edge, in any sequence of 100 trades, the mathematical probability of experiencing a 4 to 6 trade losing streak approaches 87%. If you risk 2% per trade, that inevitable normal variance eliminates your funded status.
      </p>
      <p>
        By lowering base risk to 0.5% or 0.75%, you withstand statistical variance effortlessly and preserve mental capital, allowing your edge to compound cleanly over time.
      </p>

      <h2 id="dynamic-position-sizing">4. Dynamic Sizing via Synapses Risk Calculator</h2>
      <p>
        Always calculate position sizes prior to execution using tick-value formulas. Never eyeball lot sizes. Log your sizing parameters directly in the Synapses Risk Calculator to enforce automatic daily drawdown lockouts.
      </p>
    `,
  },
  {
    slug: 'anatomy-of-fair-value-gap-premium-vs-discount',
    title: 'Anatomy of a Fair Value Gap (FVG): Premium vs. Discount Arrays Explained',
    subtitle: 'Mastering 3-candle price imbalances, mitigation dynamics, and equilibrium profiling for high-probability trade location.',
    category: 'Market Microstructure & Order Flow',
    publishedAt: '2026-08-22',
    readTime: '8 min read',
    featured: false,
    author: {
      name: 'Dr. Michael Thorne',
      role: 'Head of Quantitative Strategy',
      avatarInitials: 'MT',
    },
    keyTakeaway:
      'A Fair Value Gap is not a magic rectangle; it is an inefficiency created by unilateral market delivery. Only trade FVGs that sit in discount for long positions or premium for short positions relative to the dealing range equilibrium.',
    tableOfContents: [
      { id: 'what-is-fvg', title: '1. Defining the 3-Candle Imbalance Structure' },
      { id: 'bisi-vs-sibi', title: '2. BISI vs. SIBI Imbalance Mechanics' },
      { id: 'premium-discount-consequent', title: '3. Premium, Discount, and Consequent Encroachment (C.E.)' },
      { id: 'invalidation-criteria', title: '4. Structural Invalidation vs. Clean Mitigation' },
    ],
    content: `
      <h2 id="what-is-fvg">1. Defining the 3-Candle Imbalance Structure</h2>
      <p>
        A Fair Value Gap represents a three-candle sequence where Candle 1 and Candle 3 do not overlap. The middle candle (Candle 2) expands with extreme velocity, offering liquidity to only one side of the order book.
      </p>

      <h2 id="bisi-vs-sibi">2. BISI vs. SIBI Imbalance Mechanics</h2>
      <ul>
        <li><strong>BISI (Buyside Imbalance, Sellside Inefficiency):</strong> A massive green expansion candle where price offered solely buying opportunities. The market must re-deliver price downward into this gap to balance the book.</li>
        <li><strong>SIBI (Sellside Imbalance, Buyside Inefficiency):</strong> A red expansion displacement candle where sell orders overwhelmed bids, leaving buyside orders unfilled.</li>
      </ul>

      <h2 id="premium-discount-consequent">3. Premium, Discount, and Consequent Encroachment (C.E.)</h2>
      <p>
        A fundamental rule of institutional order flow is: <strong>Never buy in Premium; never sell in Discount.</strong>
      </p>
      <p>
        Anchor your Fibonacci tool from the low to the high of the current dealing range. The 50% level is Equilibrium:
      </p>
      <ul>
        <li><strong>Above 50%:</strong> Premium Array — Search for SIBIs and Bearish Order Blocks for short setups.</li>
        <li><strong>Below 50%:</strong> Discount Array — Search for BISIs and Bullish Order Blocks for long setups.</li>
        <li><strong>Consequent Encroachment (C.E.):</strong> The precise 50% midpoint of the FVG itself. Institutional algorithms frequently respect C.E. down to the tick before resuming directional expansion.</li>
      </ul>

      <h2 id="invalidation-criteria">4. Structural Invalidation vs. Clean Mitigation</h2>
      <p>
        If a candle body closes through the opposite boundary of an FVG, the imbalance is violated and inverted. It transitions into an "Inversion Fair Value Gap," which often acts as structural resistance on retest.
      </p>
    `,
  },
  {
    slug: 'eliminating-revenge-trading-mechanical-logging',
    title: 'Eliminating Revenge Trading: How Mechanical Trade Logging Recalibrates Brain Chemistry',
    subtitle: 'The neurobiology of trading losses, cortisol spikes, and how systematic post-trade journaling interrupts irrational emotional cascades.',
    category: 'Trading Psychology',
    publishedAt: '2026-08-15',
    readTime: '5 min read',
    featured: false,
    author: {
      name: 'Julian Vance',
      role: 'Behavioral Finance Lead',
      avatarInitials: 'JV',
    },
    keyTakeaway:
      'When you take an unplanned loss, your amygdala activates the same threat circuitry as physical danger, flooding your prefrontal cortex with cortisol. Requiring a 3-minute mechanical log of confluences before the next order forcibly restores cognitive control.',
    tableOfContents: [
      { id: 'neuroscience-of-a-loss', title: '1. The Neurobiology of Market Pain' },
      { id: 'why-notion-and-excel-fail', title: '2. Why Notion and Spreadsheets Fail at State Regulation' },
      { id: 'the-synapses-cooling-protocol', title: '3. The Synapses Mechanical Cooling Protocol' },
      { id: 'long-term-rewiring', title: '4. Neuroplasticity: Rewiring Your Relationship with Losses' },
    ],
    content: `
      <h2 id="neuroscience-of-a-loss">1. The Neurobiology of Market Pain</h2>
      <p>
        Financial loss registers in the brain as physical trauma. Neuroimaging studies demonstrate that an abrupt, unexpected loss triggers the anterior insular cortex and the amygdala. Blood flow is redirected away from the prefrontal cortex—the exact region responsible for statistical thinking, risk management, and long-term planning.
      </p>
      <p>
        In this hijacked state, the trader does not see probability; they see an adversary that must be conquered immediately. This is the genesis of the revenge trade.
      </p>

      <h2 id="why-notion-and-excel-fail">2. Why Notion and Spreadsheets Fail at State Regulation</h2>
      <p>
        Most traders log trades hours or days after their session in spreadsheets or Notion databases. By that time, the psychological lesson is already obsolete. Post-mortem journaling does nothing to stop the impulsive 5-lot revenge execution occurring in the heat of the New York open.
      </p>

      <h2 id="the-synapses-cooling-protocol">3. The Synapses Mechanical Cooling Protocol</h2>
      <p>
        Synapses Journal introduces cognitive friction. When you log an execution:
      </p>
      <ol>
        <li>You must manually record entry, stop, and target parameters.</li>
        <li>You must categorize your emotional state: <em>Disciplined, FOMO, Hesitant, Greedy, or Revenge</em>.</li>
        <li>You must verify your confluence tags (FVG, Liquidity Sweep, MSS).</li>
      </ol>
      <p>
        This structured 60-second exercise forces analytical prefrontal cortex reactivation, dispersing emotional impulses and preventing devastating consecutive blowups.
      </p>

      <h2 id="long-term-rewiring">4. Neuroplasticity: Rewiring Your Relationship with Losses</h2>
      <p>
        When you see losses recorded cleanly alongside "+3R" winners in your Synapses Playbook, your subconscious mind begins recognizing that losses are simply business overhead, not attacks on your personal identity.
      </p>
    `,
  },
];
