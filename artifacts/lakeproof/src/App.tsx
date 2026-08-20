import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ArrowLeft, ArrowRight, Check, ChevronDown, CircleAlert, Clock3, Download, MapPin, Menu, Plus, QrCode, Search, ShieldCheck, Wifi, X } from 'lucide-react';
import { Link, Route, Switch, useLocation, useParams } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type Stage = 'Catch' | 'Landing' | 'Transport' | 'Processing' | 'Market';
type CustodyEvent = { sequence: number; stage: Stage; actor: string; timestamp: string; location: string; eventHash: string; predecessorHash: string; notes: string };
type Batch = { publicId: string; species: string; weightKg: number; gear: string; fisherId: string; catchDateTime: string; landingSite: string; coordinates: string; latestStage: Stage; chainHeadHash: string; custodyEvents: CustodyEvent[] };

const stages: Stage[] = ['Catch', 'Landing', 'Transport', 'Processing', 'Market'];
const event = (sequence: number, stage: Stage, actor: string, timestamp: string, location: string, hash: string, predecessorHash: string, notes: string): CustodyEvent => ({ sequence, stage, actor, timestamp, location, eventHash: hash, predecessorHash, notes });
let demoBatches: Batch[] = [
  {
    publicId: 'LP-7K4M-82Q', species: 'Nile perch', weightKg: 38.5, gear: 'Gillnet · 4 inch', fisherId: 'FIS-KSM-0418', catchDateTime: '2025-06-18T05:42:00', landingSite: 'Dunga Beach, Kisumu', coordinates: '-0.1079, 34.7642', latestStage: 'Landing', chainHeadHash: 'sha256:9d4c7a2f8b91c0e1…a61e',
    custodyEvents: [
      event(1, 'Catch', 'Otieno Ouma · FIS-KSM-0418', '18 Jun 2025 · 05:42', 'Lake Victoria, Kisumu basin', 'sha256:4a7f2c90…90ed', '—', 'Catch registered from vessel log and landing-site intake.'),
      event(2, 'Landing', 'Achieng Odhiambo · DUN-03', '18 Jun 2025 · 07:18', 'Dunga Beach landing site', 'sha256:9d4c7a2f…a61e', 'sha256:4a7f2c90…90ed', 'Weight confirmed at receiving table.')
    ]
  },
  {
    publicId: 'LP-3N8R-11C', species: 'Nile perch', weightKg: 62, gear: 'Longline', fisherId: 'FIS-HOM-1027', catchDateTime: '2025-06-18T04:28:00', landingSite: 'Kendu Bay', coordinates: '-0.4388, 34.6461', latestStage: 'Processing', chainHeadHash: 'sha256:1f0ba804…d310',
    custodyEvents: [
      event(1, 'Catch', 'Moses Ochieng · FIS-HOM-1027', '18 Jun 2025 · 04:28', 'Lake Victoria, Homa Bay basin', 'sha256:71ab…1c29', '—', 'Catch registered at source.'),
      event(2, 'Landing', 'Kendu Bay Landing Office', '18 Jun 2025 · 06:50', 'Kendu Bay landing site', 'sha256:8e11…94b0', 'sha256:71ab…1c29', 'Species and weight inspected.'),
      event(3, 'Transport', 'Victoria Cold Chain Ltd', '18 Jun 2025 · 09:05', 'Kendu Bay → Kisumu', 'sha256:1f0b…d310', 'sha256:8e11…94b0', 'Sealed vehicle departed with temperature record.')
    ]
  },
  {
    publicId: 'LP-9P2D-54A', species: 'Dagaa', weightKg: 14.2, gear: 'Small seine', fisherId: 'FIS-SIA-0789', catchDateTime: '2025-06-17T19:12:00', landingSite: 'Siu Beach, Siaya', coordinates: '-0.0826, 34.1863', latestStage: 'Market', chainHeadHash: 'sha256:6c3d12aa…44f8',
    custodyEvents: [
      event(1, 'Catch', 'Atieno Auma · FIS-SIA-0789', '17 Jun 2025 · 19:12', 'Lake Victoria, Siaya basin', 'sha256:2ce0…7d10', '—', 'Catch registered at source.'),
      event(2, 'Landing', 'Siu Beach Agent', '17 Jun 2025 · 20:01', 'Siu Beach landing site', 'sha256:b31a…1182', 'sha256:2ce0…7d10', 'Landing record accepted.'),
      event(3, 'Transport', 'Lake Route Cooperative', '18 Jun 2025 · 06:40', 'Siu Beach → Kisumu', 'sha256:8d42…13b0', 'sha256:b31a…1182', 'Cooperative transport manifest attached.'),
      event(4, 'Processing', 'Kisumu Fish Processors', '18 Jun 2025 · 09:30', 'Kisumu industrial area', 'sha256:6c3d…44f8', 'sha256:8d42…13b0', 'Packed and lot-labelled for market.')
    ]
  },
  {
    publicId: 'LP-5T6B-38L', species: 'Tilapia', weightKg: 27.8, gear: 'Gillnet · 3 inch', fisherId: 'FIS-KSM-0612', catchDateTime: '2025-06-18T06:15:00', landingSite: 'Usoma Beach, Kisumu', coordinates: '-0.0871, 34.7128', latestStage: 'Catch', chainHeadHash: 'sha256:b5a2c091…7ddc',
    custodyEvents: [event(1, 'Catch', 'Jared Onyango · FIS-KSM-0612', '18 Jun 2025 · 06:15', 'Lake Victoria, Kisumu basin', 'sha256:b5a2…7ddc', '—', 'Catch registered; awaiting landing-site confirmation.')]
  }
];

const queryClient = new QueryClient();
const dateLabel = (value: string) => new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

function Brand() {
  return <Link href="/" className="brand-mark" data-testid="link-brand"><span className="brand-symbol" aria-hidden="true" /><span>LakeProof</span></Link>;
}

function Shell({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  const [menu, setMenu] = useState(false);
  return <div className={`paper page ${dark ? 'dark-band' : ''}`}>
    <header className="shell topbar">
      <Brand />
      <nav className="navlinks" aria-label="Primary navigation">
        <Link href="/verify" data-testid="link-verify">Verify a catch</Link>
        <Link href="/operations" data-testid="link-operations">Operations</Link>
        <Link href="/dashboard" data-testid="link-dashboard">Overview</Link>
        <Link href="/foundations" data-testid="link-foundations">Foundations</Link>
      </nav>
      <div className="mobile-menu">
        <button className="pill" onClick={() => setMenu(!menu)} aria-label="Toggle menu" data-testid="button-menu">{menu ? <X size={15} /> : <Menu size={15} />}</button>
        <Link href="/register" className="pill pill-solid" data-testid="link-register-mobile">Register fisher</Link>
      </div>
      <Link href="/register" className="pill pill-solid nav-register" data-testid="link-register">Register fisher <ArrowRight size={14} /></Link>
    </header>
    {menu && <div className="shell mobile-nav" style={{ paddingTop: 15, paddingBottom: 15, display: 'grid', gap: 14 }}>
      <Link href="/verify" data-testid="mobile-link-verify">Verify a catch</Link><Link href="/operations" data-testid="mobile-link-operations">Operations</Link><Link href="/dashboard" data-testid="mobile-link-dashboard">Overview</Link><Link href="/foundations" data-testid="mobile-link-foundations">Foundations</Link>
    </div>}
    {children}
    <footer className="shell rule" style={{ paddingTop: 25, paddingBottom: 25, display: 'flex', justifyContent: 'space-between', gap: 20, fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>
      <span>LakeProof · Evidence for every landing</span><span className="mono">LAKE VICTORIA · EAC</span>
    </footer>
  </div>;
}

function Home() {
  return <Shell>
    <main>
      <div className="shell hero">
        <div>
          <div className="eyebrow">A catch passport for Lake Victoria</div>
          <h1>Every catch<br />has a <em>story.</em></h1>
          <p className="hero-copy">LakeProof records the journey from lake to market — giving the people around Lake Victoria a shared, trustworthy account of what was caught, where, and by whom.</p>
          <div className="hero-actions"><Link href="/register" className="pill pill-solid" data-testid="hero-register">Register a fisher <ArrowRight size={14} /></Link><Link href="/verify" className="pill" data-testid="hero-verify">Look up a proof <Search size={14} /></Link></div>
          <div className="status-line" style={{ marginTop: 30 }}><span className="status-dot" /> Operating across the lake region <span className="gold">·</span> Offline-ready</div>
        </div>
        <figure className="hero-art"><img src="/images/crew.jpg" alt="Fishers preparing a net beside a wooden boat on Lake Victoria" /><figcaption className="art-caption"><span className="mono">01 / SOURCE</span><br />Dunga Beach, Kisumu · The record begins where the net comes ashore.</figcaption></figure>
      </div>
      <section className="shell story-grid rule">
        <div><div className="eyebrow">The gap we close</div><h2>Trust should travel with the fish.</h2></div>
        <div><p>Across the lake, the people who catch, receive, inspect, move, process, and buy fish each hold one part of the story. LakeProof gives that story a common spine: a public identifier, a sequence of custody events, and a verifiable record at each handover.</p><p className="quote">“Not a promise that the first entry was perfect. A clear account of what was accepted, and what happened next.”</p></div>
      </section>
      <section className="shell feature-row">
        <div className="feature"><div className="eyebrow gold">01 / Source</div><h3>Register at the water</h3><p>Capture species, gear, weight, fisher identity, time, place, and the conditions of the first record.</p></div>
        <div className="feature"><div className="eyebrow gold">02 / Chain</div><h3>Pass the record on</h3><p>Each custody stage adds a signed event without rewriting what came before.</p></div>
        <div className="feature"><div className="eyebrow gold">03 / Proof</div><h3>Let anyone check</h3><p>Buyers, regulators, and consumers can verify a public ID and see the redacted timeline.</p></div>
      </section>
      <section className="dark-band"><div className="shell" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 70 }}>
        <div><div className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>The fixed lifecycle</div><h2 className="section-title" style={{ color: 'hsl(var(--primary-foreground))' }}>Five hands.<br /><em>One account.</em></h2></div>
        <div style={{ alignSelf: 'end' }}><p>LakeProof does not add an invented layer of complexity. It follows the existing working rhythm of the trade.</p><div className="stage-strip" style={{ borderColor: 'hsl(157 25% 40%)' }}>{stages.map((stage, i) => <div className="stage-item" style={{ borderColor: 'hsl(157 25% 40%)', color: 'hsl(42 22% 77%)' }} key={stage}><span>0{i + 1}</span>{stage}</div>)}</div><Link href="/foundations" className="pill" style={{ borderColor: 'hsl(var(--accent))', color: 'hsl(var(--accent))' }} data-testid="link-foundations-band">Read the foundations <ArrowRight size={14} /></Link></div>
      </div></section>
    </main>
  </Shell>;
}

function PageHead({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1></div>{children && <div>{children}</div>}</div>;
}

function RegisterFisher() {
  const [submitted, setSubmitted] = useState<{ fisherId: string; name: string; phone: string; vesselName: string } | null>(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    fisherId: '',
    nationalId: '',
    village: '',
    district: '',
    gender: 'Not specified',
    language: 'English',
    vesselName: '',
    vesselRegistration: '',
    vesselType: 'Motorized boat',
    gearType: 'Gillnet · 4 inch',
    licenseStatus: 'Valid',
    ownerType: 'Individual',
    walletAddress: ''
  });

  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.fisherId) return;
    const generatedId = `FIS-${form.district?.substring(0, 3).toUpperCase() || 'LAK'}-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`;
    setSubmitted({
      fisherId: generatedId,
      name: form.name,
      phone: form.phone,
      vesselName: form.vesselName
    });
  };

  if (submitted)
    return (
      <Shell>
        <main className="shell page-main">
          <div className="lookup-shell" style={{ paddingTop: 30 }}>
            <div className="success-box">
              <Check size={24} color="hsl(145 28% 38%)" />
              <h2>Fisher registered successfully.</h2>
              <p>Your identity is now linked to the blockchain traceability chain.</p>
              <div className="surface" style={{ padding: 18, textAlign: 'left', margin: '24px 0' }}>
                <div className="eyebrow">Fisher ID</div>
                <div className="serif" style={{ fontSize: 31, marginTop: 4 }}>{submitted.fisherId}</div>
                <div className="status-line" style={{ marginTop: 12 }}>
                  <span className="status-dot gold-dot" /> Ready to register catch
                </div>
                <div style={{ marginTop: 18, padding: '12px 0', borderTop: '1px solid hsl(var(--border))' }}>
                  <div className="mono" style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Registered as: {submitted.name}</div>
                  <div className="mono" style={{ fontSize: 11, color: 'hsl(var(--muted-foreground))', marginTop: 6 }}>Vessel: {submitted.vesselName || 'Not specified'}</div>
                </div>
              </div>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <Link href="/register-catch" className="pill pill-solid" data-testid="link-register-catch">
                  Register a catch <ArrowRight size={14} />
                </Link>
                <button className="pill" onClick={() => setSubmitted(null)} data-testid="button-register-another-fisher">
                  <Plus size={14} /> Register another fisher
                </button>
              </div>
            </div>
          </div>
        </main>
      </Shell>
    );

  return (
    <Shell>
      <main className="shell page-main">
        <PageHead eyebrow="Fisher registration / 00" title="Register as a fisher">
          <p>Create your blockchain identity. This record links your identity to every catch you register.</p>
        </PageHead>
        <div className="form-layout">
          <form className="surface surface-pad" onSubmit={submit}>
            <div className="section-label">
              <strong>Personal identity</strong>
              <span className="eyebrow">Required fields marked</span>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="name">Full name *</label>
                <input
                  id="name"
                  placeholder="e.g. Otieno Ouma"
                  value={form.name}
                  onChange={e => set('name', e.target.value)}
                  required
                  data-testid="input-fisher-name"
                />
              </div>
              <div className="field">
                <label htmlFor="phone">Phone number *</label>
                <input
                  id="phone"
                  placeholder="e.g. +254 712 345 678"
                  value={form.phone}
                  onChange={e => set('phone', e.target.value)}
                  required
                  data-testid="input-fisher-phone"
                />
              </div>
              <div className="field">
                <label htmlFor="fisher-id">Fisher ID / License number *</label>
                <input
                  id="fisher-id"
                  placeholder="e.g. FIS-KSM-0418"
                  value={form.fisherId}
                  onChange={e => set('fisherId', e.target.value)}
                  required
                  data-testid="input-fisher-license"
                />
                <small>Your registered fisher or vessel license number.</small>
              </div>
              <div className="field">
                <label htmlFor="national-id">National ID</label>
                <input
                  id="national-id"
                  placeholder="e.g. 12345678"
                  value={form.nationalId}
                  onChange={e => set('nationalId', e.target.value)}
                  data-testid="input-national-id"
                />
              </div>
              <div className="field">
                <label htmlFor="village">Village / Landing site *</label>
                <input
                  id="village"
                  placeholder="e.g. Dunga Beach"
                  value={form.village}
                  onChange={e => set('village', e.target.value)}
                  required
                  data-testid="input-village"
                />
              </div>
              <div className="field">
                <label htmlFor="district">District / County *</label>
                <select id="district" value={form.district} onChange={e => set('district', e.target.value)} required data-testid="select-district">
                  <option value="">Select district</option>
                  <option>Kisumu</option>
                  <option>Homabay</option>
                  <option>Siaya</option>
                  <option>Migori</option>
                  <option>Nakuru</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="gender">Gender</label>
                <select id="gender" value={form.gender} onChange={e => set('gender', e.target.value)} data-testid="select-gender">
                  <option>Not specified</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="language">Preferred language</label>
                <select id="language" value={form.language} onChange={e => set('language', e.target.value)} data-testid="select-language">
                  <option>English</option>
                  <option>Swahili</option>
                  <option>Luo</option>
                </select>
              </div>
            </div>

            <div className="section-label" style={{ marginTop: 28 }}>
              <strong>Vessel and gear</strong>
              <span className="eyebrow">Optional</span>
            </div>
            <div className="field-grid">
              <div className="field">
                <label htmlFor="vessel-name">Boat name</label>
                <input
                  id="vessel-name"
                  placeholder="e.g. MV Amani"
                  value={form.vesselName}
                  onChange={e => set('vesselName', e.target.value)}
                  data-testid="input-vessel-name"
                />
              </div>
              <div className="field">
                <label htmlFor="vessel-reg">Boat registration number</label>
                <input
                  id="vessel-reg"
                  placeholder="e.g. REG-2024-001"
                  value={form.vesselRegistration}
                  onChange={e => set('vesselRegistration', e.target.value)}
                  data-testid="input-vessel-registration"
                />
              </div>
              <div className="field">
                <label htmlFor="vessel-type">Vessel type</label>
                <select id="vessel-type" value={form.vesselType} onChange={e => set('vesselType', e.target.value)} data-testid="select-vessel-type">
                  <option>Motorized boat</option>
                  <option>Sail boat</option>
                  <option>Dugout canoe</option>
                  <option>Fibreglass boat</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="gear-type">Primary gear type</label>
                <select id="gear-type" value={form.gearType} onChange={e => set('gearType', e.target.value)} data-testid="select-gear-type">
                  <option>Gillnet · 4 inch</option>
                  <option>Gillnet · 3 inch</option>
                  <option>Longline</option>
                  <option>Small seine</option>
                  <option>Hook and line</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="license-status">License status</label>
                <select id="license-status" value={form.licenseStatus} onChange={e => set('licenseStatus', e.target.value)} data-testid="select-license-status">
                  <option>Valid</option>
                  <option>Expired</option>
                  <option>Pending renewal</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="owner-type">Owner type</label>
                <select id="owner-type" value={form.ownerType} onChange={e => set('ownerType', e.target.value)} data-testid="select-owner-type">
                  <option>Individual</option>
                  <option>Cooperative</option>
                  <option>Group</option>
                  <option>Company</option>
                </select>
              </div>
            </div>

            <div className="section-label" style={{ marginTop: 28 }}>
              <strong>Blockchain identity</strong>
              <span className="eyebrow">Optional</span>
            </div>
            <div className="field-grid">
              <div className="field full">
                <label htmlFor="wallet">Wallet address</label>
                <input
                  id="wallet"
                  placeholder="0x... (for blockchain transactions)"
                  value={form.walletAddress}
                  onChange={e => set('walletAddress', e.target.value)}
                  data-testid="input-wallet-address"
                />
                <small>Your blockchain wallet address for direct ledger participation.</small>
              </div>
            </div>

            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
              <div className="status-line">
                <span className="status-dot" /> Saved locally · <Wifi size={13} /> Sync ready
              </div>
              <button className="pill pill-solid" type="submit" data-testid="button-submit-fisher">
                Create Fisher ID <ArrowRight size={14} />
              </button>
            </div>
          </form>

          <aside>
            <div className="surface surface-pad">
              <div className="eyebrow">What happens next</div>
              <p style={{ fontFamily: 'var(--app-font-serif)', fontSize: 16, lineHeight: 1.35, marginTop: 12 }}>After registration, your identity becomes the source of the catch chain.</p>
              <div className="rule" style={{ margin: '18px 0' }} />
              <div className="status-line">
                <Check size={14} className="gold" /> Linked to blockchain
              </div>
              <div className="status-line" style={{ marginTop: 10 }}>
                <Check size={14} className="gold" /> Immutable after acceptance
              </div>
              <div className="status-line" style={{ marginTop: 10 }}>
                <Check size={14} className="gold" /> Ready to register catch
              </div>
            </div>
            <div className="surface surface-pad" style={{ marginTop: 14 }}>
              <div className="eyebrow">Lake Victoria Region</div>
              <div className="status-line" style={{ marginTop: 12, fontSize: 12 }}>
                <span className="status-dot gold-dot" /> 5 landing sites · 12 districts · 1 shared ledger
              </div>
            </div>
          </aside>
        </div>
      </main>
    </Shell>
  );
}

function RegisterCatch() {
  const [submitted, setSubmitted] = useState<Batch | null>(null);
  const [form, setForm] = useState({ species: 'Nile perch', weightKg: '', gear: 'Gillnet · 4 inch', fisherId: '', catchDateTime: '2025-06-18T06:40', landingSite: 'Dunga Beach, Kisumu', coordinates: '' });
  const set = (key: string, value: string) => setForm(current => ({ ...current, [key]: value }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.weightKg || !form.fisherId) return;
    const id = `LP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`;
    const created: Batch = { ...form, publicId: id, weightKg: Number(form.weightKg), coordinates: form.coordinates || '-0.1079, 34.7642', latestStage: 'Catch', chainHeadHash: 'sha256:pending…', custodyEvents: [event(1, 'Catch', `Registered fisher · ${form.fisherId}`, new Date(form.catchDateTime).toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), form.landingSite, 'sha256:pending…', '—', 'Catch record accepted from field register.')] };
    demoBatches = [created, ...demoBatches]; setSubmitted(created);
  };
  if (submitted) return <Shell><main className="shell page-main"><div className="lookup-shell" style={{ paddingTop: 30 }}><div className="success-box"><Check size={24} color="hsl(145 28% 38%)" /><h2>Catch registered.</h2><p>Your record is safely held on this device and ready for landing-site confirmation.</p><div className="surface" style={{ padding: 18, textAlign: 'left', margin: '24px 0' }}><div className="eyebrow">Public proof ID</div><div className="serif" style={{ fontSize: 31, marginTop: 4 }}>{submitted.publicId}</div><div className="status-line" style={{ marginTop: 12 }}><span className="status-dot gold-dot" /> Pending sync · saved locally</div></div><div className="hero-actions" style={{ justifyContent: 'center' }}><Link href={`/verify/${submitted.publicId}`} className="pill pill-solid" data-testid="link-view-created-proof">View proof <ArrowRight size={14} /></Link><button className="pill" onClick={() => setSubmitted(null)} data-testid="button-register-another"><Plus size={14} /> Register another</button></div></div></div></main></Shell>;
  return <Shell><main className="shell page-main"><PageHead eyebrow="Field register / 01" title="Register a catch"><p>Start a chain of evidence at the water. This record can be completed offline and synced when a connection returns.</p></PageHead><div className="form-layout"><form className="surface surface-pad" onSubmit={submit}><div className="section-label"><strong>Catch details</strong><span className="eyebrow">Required fields marked</span></div><div className="field-grid">
    <div className="field"><label htmlFor="species">Species</label><select id="species" value={form.species} onChange={e => set('species', e.target.value)} data-testid="select-species"><option>Nile perch</option><option>Tilapia</option><option>Dagaa</option><option>Haplochromines</option></select></div>
    <div className="field"><label htmlFor="weight">Weight (kg)</label><input id="weight" type="number" step=".1" placeholder="e.g. 38.5" value={form.weightKg} onChange={e => set('weightKg', e.target.value)} required data-testid="input-weight" /></div>
    <div className="field"><label htmlFor="gear">Gear type</label><select id="gear" value={form.gear} onChange={e => set('gear', e.target.value)} data-testid="select-gear"><option>Gillnet · 4 inch</option><option>Gillnet · 3 inch</option><option>Longline</option><option>Small seine</option><option>Hook and line</option></select></div>
    <div className="field"><label htmlFor="fisher">Fisher identifier</label><input id="fisher" placeholder="e.g. FIS-KSM-0418" value={form.fisherId} onChange={e => set('fisherId', e.target.value)} required data-testid="input-fisher-id" /><small>Use the registered fisher or vessel ID.</small></div>
    <div className="field"><label htmlFor="time">Catch date and time</label><input id="time" type="datetime-local" value={form.catchDateTime} onChange={e => set('catchDateTime', e.target.value)} data-testid="input-catch-time" /></div>
    <div className="field"><label htmlFor="site">Landing site</label><select id="site" value={form.landingSite} onChange={e => set('landingSite', e.target.value)} data-testid="select-landing-site"><option>Dunga Beach, Kisumu</option><option>Kendu Bay</option><option>Usoma Beach, Kisumu</option><option>Siu Beach, Siaya</option><option>Mbita Point</option></select></div>
    <div className="field full"><label htmlFor="coordinates">Coordinates / GPS</label><div style={{ display: 'flex', gap: 8 }}><input id="coordinates" placeholder="Tap locate or enter latitude, longitude" value={form.coordinates} onChange={e => set('coordinates', e.target.value)} data-testid="input-coordinates" /><button className="pill" type="button" onClick={() => set('coordinates', '-0.1079, 34.7642')} data-testid="button-locate"><MapPin size={14} /> Locate</button></div><small>GPS is an affordance for context; a record can be submitted without it.</small></div>
  </div><div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}><div className="status-line"><span className="status-dot" /> Saved locally · <Wifi size={13} /> Sync ready</div><button className="pill pill-solid" type="submit" data-testid="button-submit-catch">Accept catch <ArrowRight size={14} /></button></div></form>
  <aside><div className="map-card"><div className="map-inner"><div><div className="eyebrow" style={{ color: 'hsl(42 22% 77%)' }}>Location context</div><strong style={{ display: 'block', marginTop: 7 }}>Lake Victoria</strong></div><div className="map-pin" /><div className="mono" style={{ fontSize: 10, color: 'hsl(42 22% 77%)' }}>{form.coordinates || 'GPS not captured yet'}</div></div></div><div className="surface surface-pad" style={{ marginTop: 14 }}><div className="eyebrow">Before you submit</div><p style={{ fontFamily: 'var(--app-font-serif)', fontSize: 20, lineHeight: 1.25 }}>Record what was accepted. Keep the first truth with the person who saw it.</p><div className="rule" style={{ margin: '18px 0' }} /><div className="status-line"><Check size={14} className="gold" /> Immutable after acceptance</div><div className="status-line" style={{ marginTop: 10 }}><Check size={14} className="gold" /> Public ID is redacted</div></div></aside></div></main></Shell>;
}

function Verify() {
  const [, navigate] = useLocation();
  const [id, setId] = useState('');
  const [error, setError] = useState('');
  const submit = (e: React.FormEvent) => { e.preventDefault(); const found = demoBatches.find(batch => batch.publicId.toLowerCase() === id.trim().toLowerCase()); if (found) navigate(`/verify/${found.publicId}`); else setError('No public proof was found for that ID. Try LP-7K4M-82Q.'); };
  return <Shell><main className="shell page-main"><div className="lookup-shell"><div className="eyebrow">Public record / Verify</div><h1>Look closer.<br /><em>Know more.</em></h1><p>Enter a LakeProof public ID to see the redacted journey of a catch — from its first accepted record to its latest handover.</p><form className="lookup-form" onSubmit={submit}><input className="lookup-input mono" placeholder="LP-7K4M-82Q" value={id} onChange={e => { setId(e.target.value); setError(''); }} aria-label="Public proof ID" data-testid="input-proof-id" /><button className="pill pill-solid" type="submit" data-testid="button-lookup">Verify <Search size={14} /></button></form>{error && <div style={{ marginTop: 17, color: 'hsl(var(--destructive))', fontSize: 12 }} data-testid="status-lookup-error"><CircleAlert size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 5 }} />{error}</div>}<div className="rule" style={{ marginTop: 65, paddingTop: 18, textAlign: 'left', fontSize: 12, color: 'hsl(var(--muted-foreground))' }}>A public proof shows accepted record fields and custody events. Personal details and sensitive commercial information stay redacted.</div></div></main></Shell>;
}

function Proof({ operations = false }: { operations?: boolean }) {
  const params = useParams<{ id: string }>();
  const batch = demoBatches.find(item => item.publicId.toLowerCase() === (params.id || '').toLowerCase()) || demoBatches[0];
  const [expanded, setExpanded] = useState<number | null>(batch.custodyEvents.length - 1);
  const [advanced, setAdvanced] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [, navigate] = useLocation();
  const currentIndex = stages.indexOf(batch.latestStage);

  // Landing Form (from Catch to Landing)
  const [landingForm, setLandingForm] = useState({ agentName: '', agentId: '', weightConfirmed: batch.weightKg.toString(), weightVariance: '0', condition: 'Good', quality: 'Premium', receivingTime: new Date().toISOString().slice(0, 16), notes: '', inspectionCheckmarks: { weighingScale: false, icePresence: false, temperatureRecord: false, damageAssessment: false } });

  // Transport Form (from Landing to Transport)
  const [transportForm, setTransportForm] = useState({ transporterName: '', transporterId: '', vehicleType: 'Refrigerated truck', temperatureSet: '4', sealNumber: '', departureTime: new Date().toISOString().slice(0, 16), arrivalLocation: '', estimatedArrival: '', notes: '' });

  // Processing Form (from Transport to Processing)
  const [processingForm, setProcessingForm] = useState({ processorName: '', processorId: '', processingType: 'Filleting', packingDate: new Date().toISOString().slice(0, 16), storageCondition: 'Frozen', lotNumber: '', finalWeight: batch.weightKg.toString(), notes: '' });

  // Market Form (from Processing to Market)
  const [marketForm, setMarketForm] = useState({ buyerName: '', buyerId: '', marketLocation: '', salePrice: '', currency: 'KES', saleDate: new Date().toISOString().slice(0, 16), quantity: batch.weightKg.toString(), notes: '' });

  const createHandoverEvent = (agentName: string, agentId: string, nextStage: Stage, location: string, notes: string) => {
    const nextSequence = batch.custodyEvents.length + 1;
    const newEvent = event(nextSequence, nextStage, `${agentName} · ${agentId}`, new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }), location, `sha256:${Math.random().toString(36).slice(2)}…${Math.random().toString(36).slice(2, 7)}`, batch.chainHeadHash, notes);
    batch.custodyEvents.push(newEvent);
    batch.latestStage = nextStage;
    batch.chainHeadHash = newEvent.eventHash;
  };

  const submitLanding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!landingForm.agentName || !landingForm.agentId) return;
    const notes = `${landingForm.notes || 'Fish received and documented.'} [Weight confirmed: ${landingForm.weightConfirmed}kg, Condition: ${landingForm.condition}]`;
    createHandoverEvent(landingForm.agentName, landingForm.agentId, 'Landing', batch.landingSite, notes);
    setSuccessMessage(`Landing handover recorded by ${landingForm.agentName}`);
    setSubmitted(true);
  };

  const submitTransport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transportForm.transporterName || !transportForm.transporterId) return;
    const notes = `${transportForm.notes || 'Fish transported.'} [Vehicle: ${transportForm.vehicleType}, Temperature: ${transportForm.temperatureSet}°C, Seal: ${transportForm.sealNumber}]`;
    createHandoverEvent(transportForm.transporterName, transportForm.transporterId, 'Transport', `${batch.landingSite} → ${transportForm.arrivalLocation}`, notes);
    setSuccessMessage(`Transport handover recorded by ${transportForm.transporterName}`);
    setSubmitted(true);
  };

  const submitProcessing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!processingForm.processorName || !processingForm.processorId) return;
    const notes = `${processingForm.notes || 'Fish processed.'} [Type: ${processingForm.processingType}, Lot: ${processingForm.lotNumber}, Storage: ${processingForm.storageCondition}]`;
    createHandoverEvent(processingForm.processorName, processingForm.processorId, 'Processing', 'Processing facility', notes);
    setSuccessMessage(`Processing handover recorded by ${processingForm.processorName}`);
    setSubmitted(true);
  };

  const submitMarket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketForm.buyerName || !marketForm.buyerId) return;
    const notes = `${marketForm.notes || 'Fish sold.'} [Market: ${marketForm.marketLocation}, Price: ${marketForm.salePrice} ${marketForm.currency}]`;
    createHandoverEvent(marketForm.buyerName, marketForm.buyerId, 'Market', marketForm.marketLocation, notes);
    setSuccessMessage(`Market handover recorded by ${marketForm.buyerName}`);
    setSubmitted(true);
  };

  const getFormTitle = () => {
    if (batch.latestStage === 'Catch') return 'Landing handover form';
    if (batch.latestStage === 'Landing') return 'Transport handover form';
    if (batch.latestStage === 'Transport') return 'Processing handover form';
    if (batch.latestStage === 'Processing') return 'Market handover form';
    return 'Handover form';
  };

  const getFormDescription = () => {
    if (batch.latestStage === 'Catch') return 'Record details as the fish transfer to the landing site. Document the receiving agent, weight confirmation, and condition assessment.';
    if (batch.latestStage === 'Landing') return 'Document the transport details including vehicle type, temperature control, and departure time.';
    if (batch.latestStage === 'Transport') return 'Record processing details including type of processing, packing, and storage conditions.';
    if (batch.latestStage === 'Processing') return 'Document the final sale including buyer details, market location, and price.';
    return '';
  };

  const renderForm = () => {
    if (batch.latestStage === 'Catch') {
      return <form onSubmit={submitLanding} data-testid="form-landing-handover"><div className="field-grid"><div className="field"><label htmlFor="agent-name">Receiving agent name *</label><input id="agent-name" placeholder="e.g. John Kipchoge" value={landingForm.agentName} onChange={e => setLandingForm(current => ({ ...current, agentName: e.target.value }))} required data-testid="input-agent-name" /></div><div className="field"><label htmlFor="agent-id">Agent ID / License *</label><input id="agent-id" placeholder="e.g. LAN-DUN-023" value={landingForm.agentId} onChange={e => setLandingForm(current => ({ ...current, agentId: e.target.value }))} required data-testid="input-agent-id" /></div><div className="field"><label htmlFor="weight-confirmed">Weight confirmed (kg) *</label><input id="weight-confirmed" type="number" step=".1" value={landingForm.weightConfirmed} onChange={e => setLandingForm(current => ({ ...current, weightConfirmed: e.target.value }))} required data-testid="input-weight-confirmed" /></div><div className="field"><label htmlFor="weight-variance">Weight variance (kg)</label><input id="weight-variance" type="number" step=".1" placeholder="Difference from reported weight" value={landingForm.weightVariance} onChange={e => setLandingForm(current => ({ ...current, weightVariance: e.target.value }))} data-testid="input-weight-variance" /></div><div className="field"><label htmlFor="condition">Fish condition *</label><select id="condition" value={landingForm.condition} onChange={e => setLandingForm(current => ({ ...current, condition: e.target.value }))} required data-testid="select-condition"><option>Good</option><option>Fair</option><option>Poor</option></select></div><div className="field"><label htmlFor="quality">Quality grade *</label><select id="quality" value={landingForm.quality} onChange={e => setLandingForm(current => ({ ...current, quality: e.target.value }))} required data-testid="select-quality"><option>Premium</option><option>Grade A</option><option>Grade B</option><option>Grade C</option></select></div><div className="field"><label htmlFor="receive-time">Receiving time *</label><input id="receive-time" type="datetime-local" value={landingForm.receivingTime} onChange={e => setLandingForm(current => ({ ...current, receivingTime: e.target.value }))} required data-testid="input-receive-time" /></div><div className="field full"><label htmlFor="notes">Inspection notes</label><textarea id="notes" placeholder="Record any observations about the catch condition, damage, or special handling requirements." value={landingForm.notes} onChange={e => setLandingForm(current => ({ ...current, notes: e.target.value }))} rows={3} style={{ fontFamily: 'var(--app-font-sans)', fontSize: 13 }} data-testid="input-notes" /></div></div><div className="section-label" style={{ marginTop: 20 }}><strong>Receiving checklist</strong></div><div style={{ display: 'grid', gap: 10 }}><label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}><input type="checkbox" checked={landingForm.inspectionCheckmarks.weighingScale} onChange={e => setLandingForm(current => ({ ...current, inspectionCheckmarks: { ...current.inspectionCheckmarks, weighingScale: e.target.checked } }))} data-testid="check-weighing-scale" /><span>Weighing scale used and verified</span></label><label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}><input type="checkbox" checked={landingForm.inspectionCheckmarks.icePresence} onChange={e => setLandingForm(current => ({ ...current, inspectionCheckmarks: { ...current.inspectionCheckmarks, icePresence: e.target.checked } }))} data-testid="check-ice-presence" /><span>Ice/cold chain properly maintained</span></label><label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}><input type="checkbox" checked={landingForm.inspectionCheckmarks.temperatureRecord} onChange={e => setLandingForm(current => ({ ...current, inspectionCheckmarks: { ...current.inspectionCheckmarks, temperatureRecord: e.target.checked } }))} data-testid="check-temp-record" /><span>Temperature record documented</span></label><label style={{ display: 'flex', gap: 10, alignItems: 'center', cursor: 'pointer', fontSize: 13 }}><input type="checkbox" checked={landingForm.inspectionCheckmarks.damageAssessment} onChange={e => setLandingForm(current => ({ ...current, inspectionCheckmarks: { ...current.inspectionCheckmarks, damageAssessment: e.target.checked } }))} data-testid="check-damage" /><span>Damage assessment completed</span></label></div><div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}><div className="status-line"><span className="status-dot" /> Record will be immutable after acceptance</div><div style={{ display: 'flex', gap: 10 }}><button className="pill" type="button" onClick={() => setAdvanced(false)} data-testid="button-cancel-landing">Cancel</button><button className="pill pill-solid" type="submit" data-testid="button-submit-landing">Record handover <ArrowRight size={14} /></button></div></div></form>;
    }
    if (batch.latestStage === 'Landing') {
      return <form onSubmit={submitTransport} data-testid="form-transport-handover"><div className="field-grid"><div className="field"><label htmlFor="transporter-name">Transporter name *</label><input id="transporter-name" placeholder="e.g. James Kipchoge" value={transportForm.transporterName} onChange={e => setTransportForm(current => ({ ...current, transporterName: e.target.value }))} required data-testid="input-transporter-name" /></div><div className="field"><label htmlFor="transporter-id">Transporter ID / License *</label><input id="transporter-id" placeholder="e.g. TRN-KSM-001" value={transportForm.transporterId} onChange={e => setTransportForm(current => ({ ...current, transporterId: e.target.value }))} required data-testid="input-transporter-id" /></div><div className="field"><label htmlFor="vehicle-type">Vehicle type *</label><select id="vehicle-type" value={transportForm.vehicleType} onChange={e => setTransportForm(current => ({ ...current, vehicleType: e.target.value }))} required data-testid="select-vehicle-type"><option>Refrigerated truck</option><option>Ice box truck</option><option>Standard truck</option><option>Motorcycle</option><option>Bicycle</option></select></div><div className="field"><label htmlFor="temperature">Temperature setting (°C) *</label><input id="temperature" type="number" step=".1" value={transportForm.temperatureSet} onChange={e => setTransportForm(current => ({ ...current, temperatureSet: e.target.value }))} required data-testid="input-temperature" /></div><div className="field"><label htmlFor="seal-number">Seal/Lock number</label><input id="seal-number" placeholder="e.g. SEAL-2025-001" value={transportForm.sealNumber} onChange={e => setTransportForm(current => ({ ...current, sealNumber: e.target.value }))} data-testid="input-seal-number" /></div><div className="field"><label htmlFor="departure-time">Departure time *</label><input id="departure-time" type="datetime-local" value={transportForm.departureTime} onChange={e => setTransportForm(current => ({ ...current, departureTime: e.target.value }))} required data-testid="input-departure-time" /></div><div className="field"><label htmlFor="arrival-location">Arrival location</label><input id="arrival-location" placeholder="e.g. Kisumu Central Market" value={transportForm.arrivalLocation} onChange={e => setTransportForm(current => ({ ...current, arrivalLocation: e.target.value }))} data-testid="input-arrival-location" /></div><div className="field"><label htmlFor="estimated-arrival">Estimated arrival time</label><input id="estimated-arrival" type="datetime-local" value={transportForm.estimatedArrival} onChange={e => setTransportForm(current => ({ ...current, estimatedArrival: e.target.value }))} data-testid="input-estimated-arrival" /></div><div className="field full"><label htmlFor="notes">Transport notes</label><textarea id="notes" placeholder="Record any observations about transport conditions, delays, or incidents." value={transportForm.notes} onChange={e => setTransportForm(current => ({ ...current, notes: e.target.value }))} rows={3} style={{ fontFamily: 'var(--app-font-sans)', fontSize: 13 }} data-testid="input-transport-notes" /></div></div><div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}><div className="status-line"><span className="status-dot" /> Temperature and seals logged</div><div style={{ display: 'flex', gap: 10 }}><button className="pill" type="button" onClick={() => setAdvanced(false)} data-testid="button-cancel-transport">Cancel</button><button className="pill pill-solid" type="submit" data-testid="button-submit-transport">Record handover <ArrowRight size={14} /></button></div></div></form>;
    }
    if (batch.latestStage === 'Transport') {
      return <form onSubmit={submitProcessing} data-testid="form-processing-handover"><div className="field-grid"><div className="field"><label htmlFor="processor-name">Processor name *</label><input id="processor-name" placeholder="e.g. Grace Kipchoge" value={processingForm.processorName} onChange={e => setProcessingForm(current => ({ ...current, processorName: e.target.value }))} required data-testid="input-processor-name" /></div><div className="field"><label htmlFor="processor-id">Processor ID / License *</label><input id="processor-id" placeholder="e.g. PRO-KSM-015" value={processingForm.processorId} onChange={e => setProcessingForm(current => ({ ...current, processorId: e.target.value }))} required data-testid="input-processor-id" /></div><div className="field"><label htmlFor="processing-type">Processing type *</label><select id="processing-type" value={processingForm.processingType} onChange={e => setProcessingForm(current => ({ ...current, processingType: e.target.value }))} required data-testid="select-processing-type"><option>Filleting</option><option>Smoking</option><option>Freezing</option><option>Canning</option><option>Drying</option></select></div><div className="field"><label htmlFor="packing-date">Packing date *</label><input id="packing-date" type="datetime-local" value={processingForm.packingDate} onChange={e => setProcessingForm(current => ({ ...current, packingDate: e.target.value }))} required data-testid="input-packing-date" /></div><div className="field"><label htmlFor="storage-condition">Storage condition *</label><select id="storage-condition" value={processingForm.storageCondition} onChange={e => setProcessingForm(current => ({ ...current, storageCondition: e.target.value }))} required data-testid="select-storage-condition"><option>Frozen</option><option>Refrigerated</option><option>Dried</option><option>Smoked</option><option>Canned</option></select></div><div className="field"><label htmlFor="lot-number">Lot/Batch number</label><input id="lot-number" placeholder="e.g. LOT-2025-A1" value={processingForm.lotNumber} onChange={e => setProcessingForm(current => ({ ...current, lotNumber: e.target.value }))} data-testid="input-lot-number" /></div><div className="field"><label htmlFor="final-weight">Final weight (kg)</label><input id="final-weight" type="number" step=".1" value={processingForm.finalWeight} onChange={e => setProcessingForm(current => ({ ...current, finalWeight: e.target.value }))} data-testid="input-final-weight" /></div><div className="field full"><label htmlFor="notes">Processing notes</label><textarea id="notes" placeholder="Record processing methods, yield loss, quality observations." value={processingForm.notes} onChange={e => setProcessingForm(current => ({ ...current, notes: e.target.value }))} rows={3} style={{ fontFamily: 'var(--app-font-sans)', fontSize: 13 }} data-testid="input-processing-notes" /></div></div><div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}><div className="status-line"><span className="status-dot" /> Lot number and storage documented</div><div style={{ display: 'flex', gap: 10 }}><button className="pill" type="button" onClick={() => setAdvanced(false)} data-testid="button-cancel-processing">Cancel</button><button className="pill pill-solid" type="submit" data-testid="button-submit-processing">Record handover <ArrowRight size={14} /></button></div></div></form>;
    }
    if (batch.latestStage === 'Processing') {
      return <form onSubmit={submitMarket} data-testid="form-market-handover"><div className="field-grid"><div className="field"><label htmlFor="buyer-name">Buyer name *</label><input id="buyer-name" placeholder="e.g. Samuel Kipchoge" value={marketForm.buyerName} onChange={e => setMarketForm(current => ({ ...current, buyerName: e.target.value }))} required data-testid="input-buyer-name" /></div><div className="field"><label htmlFor="buyer-id">Buyer ID / License *</label><input id="buyer-id" placeholder="e.g. BUY-KSM-042" value={marketForm.buyerId} onChange={e => setMarketForm(current => ({ ...current, buyerId: e.target.value }))} required data-testid="input-buyer-id" /></div><div className="field"><label htmlFor="market-location">Market location *</label><input id="market-location" placeholder="e.g. Kisumu Central Market" value={marketForm.marketLocation} onChange={e => setMarketForm(current => ({ ...current, marketLocation: e.target.value }))} required data-testid="input-market-location" /></div><div className="field"><label htmlFor="sale-price">Sale price *</label><input id="sale-price" type="number" step=".01" placeholder="e.g. 450" value={marketForm.salePrice} onChange={e => setMarketForm(current => ({ ...current, salePrice: e.target.value }))} required data-testid="input-sale-price" /></div><div className="field"><label htmlFor="currency">Currency *</label><select id="currency" value={marketForm.currency} onChange={e => setMarketForm(current => ({ ...current, currency: e.target.value }))} required data-testid="select-currency"><option>KES</option><option>USD</option><option>EUR</option></select></div><div className="field"><label htmlFor="sale-date">Sale date *</label><input id="sale-date" type="datetime-local" value={marketForm.saleDate} onChange={e => setMarketForm(current => ({ ...current, saleDate: e.target.value }))} required data-testid="input-sale-date" /></div><div className="field"><label htmlFor="quantity">Quantity (kg)</label><input id="quantity" type="number" step=".1" value={marketForm.quantity} onChange={e => setMarketForm(current => ({ ...current, quantity: e.target.value }))} data-testid="input-quantity" /></div><div className="field full"><label htmlFor="notes">Sale notes</label><textarea id="notes" placeholder="Record buyer feedback, market conditions, any issues." value={marketForm.notes} onChange={e => setMarketForm(current => ({ ...current, notes: e.target.value }))} rows={3} style={{ fontFamily: 'var(--app-font-sans)', fontSize: 13 }} data-testid="input-market-notes" /></div></div><div style={{ marginTop: 25, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}><div className="status-line"><span className="status-dot" /> Final sale documented</div><div style={{ display: 'flex', gap: 10 }}><button className="pill" type="button" onClick={() => setAdvanced(false)} data-testid="button-cancel-market">Cancel</button><button className="pill pill-solid" type="submit" data-testid="button-submit-market">Record handover <ArrowRight size={14} /></button></div></div></form>;
    }
    return null;
  };

  if (advanced && submitted) {
    return (
      <Shell>
        <main className="shell page-main">
          <div className="lookup-shell" style={{ paddingTop: 30 }}>
            <div className="success-box">
              <Check size={24} color="hsl(145 28% 38%)" />
              <h2>{successMessage}</h2>
              <p>The chain continues to the next stage.</p>
              <div className="surface" style={{ padding: 18, textAlign: 'left', margin: '24px 0' }}>
                <div className="eyebrow">Current stage</div>
                <div className="serif" style={{ fontSize: 24, marginTop: 8, textTransform: 'capitalize' }}>
                  {batch.latestStage}
                </div>
                <div className="status-line" style={{ marginTop: 12 }}>
                  <span className="status-dot gold-dot" /> Handover recorded and verified
                </div>
              </div>
              <div className="hero-actions" style={{ justifyContent: 'center' }}>
                <button
                  className="pill pill-solid"
                  onClick={() => window.location.reload()}
                  data-testid="button-view-updated-chain"
                >
                  View updated chain <ArrowRight size={14} />
                </button>
                <button className="pill" onClick={() => navigate('/operations')} data-testid="button-return-to-ops">
                  Return to operations
                </button>
              </div>
            </div>
          </div>
        </main>
      </Shell>
    );
  }

  return (
    <Shell>
      <main className="shell page-main">
        <Link
          href={operations ? '/operations' : '/verify'}
          className="status-line"
          style={{ marginBottom: 27, display: 'inline-flex' }}
          data-testid="link-back"
        >
          <ArrowLeft size={14} /> {operations ? 'Back to operations' : 'Back to lookup'}
        </Link>
        <div className="proof-head">
          <div>
            <div className="eyebrow">
              {operations ? 'Operations / Active chain' : 'Public proof / Redacted view'}
            </div>
            <h1
              style={{
                fontFamily: 'var(--app-font-serif)',
                fontSize: 'clamp(40px, 6vw, 68px)',
                lineHeight: 1,
                letterSpacing: '-.05em',
                fontWeight: 500,
                margin: '10px 0 0'
              }}
            >
              {batch.species} <em>· {batch.publicId}</em>
            </h1>
          </div>
          <div className="verdict">
            <ShieldCheck size={15} /> Chain integrity verified
          </div>
        </div>
        <div className="stage-strip">
          {stages.map((stage, index) => (
            <div key={stage} className={`stage-item ${index <= currentIndex ? 'active' : ''}`}>
              <span>0{index + 1}</span>
              {stage}
            </div>
          ))}
        </div>
        <div className="proof-grid">
          <section className="surface surface-pad">
            <div className="section-label">
              <strong>Custody timeline</strong>
              <span className="eyebrow">{batch.custodyEvents.length} of 5 events</span>
            </div>
            <div className="timeline">
              {batch.custodyEvents.map(item => (
                <div className="event" key={item.sequence}>
                  <div className="event-top">
                    <h3>{item.stage}</h3>
                    <span className="mono" style={{ fontSize: 10, color: 'hsl(var(--muted-foreground))' }}>
                      SEQ {String(item.sequence).padStart(2, '0')}
                    </span>
                  </div>
                  <p>
                    {item.actor} · {item.timestamp}
                  </p>
                  <p>{item.location}</p>
                  <button
                    onClick={() => setExpanded(expanded === item.sequence ? null : item.sequence)}
                    style={{
                      padding: '5px 0',
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      color: 'hsl(var(--primary))',
                      fontSize: 11
                    }}
                    data-testid={`button-event-details-${item.sequence}`}
                  >
                    {expanded === item.sequence ? 'Hide record details' : 'View record details'}{' '}
                    <ChevronDown size={12} style={{ verticalAlign: '-2px' }} />
                  </button>
                  {expanded === item.sequence && (
                    <div style={{ marginTop: 9, padding: '10px 0', borderTop: '1px solid hsl(var(--border))' }}>
                      <p>{item.notes}</p>
                      <div className="hash">event {item.eventHash}</div>
                      {item.predecessorHash !== '—' && <div className="hash">prev&nbsp; {item.predecessorHash}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
          <aside>
            <div className="surface surface-pad">
              <div className="eyebrow">Batch summary</div>
              <div className="batch-summary">
                <div>
                  <div className="stat-label">Species</div>
                  <div className="stat-value">{batch.species}</div>
                </div>
                <div>
                  <div className="stat-label">Weight</div>
                  <div className="stat-value">
                    {batch.weightKg}{' '}
                    <small style={{ fontFamily: 'var(--app-font-sans)', fontSize: 12 }}>kg</small>
                  </div>
                </div>
                <div>
                  <div className="stat-label">Gear</div>
                  <div className="stat-value" style={{ fontSize: 17 }}>
                    {batch.gear}
                  </div>
                </div>
                <div>
                  <div className="stat-label">Caught</div>
                  <div className="stat-value" style={{ fontSize: 17 }}>
                    {dateLabel(batch.catchDateTime)}
                  </div>
                </div>
                <div>
                  <div className="stat-label">Landing</div>
                  <div className="stat-value" style={{ fontSize: 17 }}>
                    {batch.landingSite}
                  </div>
                </div>
                <div>
                  <div className="stat-label">Coordinates</div>
                  <div className="stat-value mono" style={{ fontSize: 11 }}>
                    {batch.coordinates}
                  </div>
                </div>
              </div>
              <div className="rule" style={{ paddingTop: 17 }}>
                <div className="eyebrow">Chain head</div>
                <div className="hash" style={{ marginTop: 7 }}>
                  {batch.chainHeadHash}
                </div>
              </div>
            </div>
            <div className="surface surface-pad" style={{ marginTop: 18 }}>
              <div className="eyebrow">Actions</div>
              <div style={{ display: 'grid', gap: 9, marginTop: 15 }}>
                <button
                  className="pill"
                  style={{ justifyContent: 'center' }}
                  onClick={() => window.print()}
                  data-testid="button-export-proof"
                >
                  <Download size={14} /> Export proof
                </button>
                <button
                  className="pill"
                  style={{ justifyContent: 'center' }}
                  onClick={() => alert(`QR reference: ${batch.publicId}`)}
                  data-testid="button-show-qr"
                >
                  <QrCode size={14} /> Show QR reference
                </button>
                {operations && (
                  <button
                    className="pill pill-solid"
                    style={{ justifyContent: 'center' }}
                    onClick={() => setAdvanced(true)}
                    data-testid="button-advance-stage"
                  >
                    <Plus size={14} /> Add next-stage event
                  </button>
                )}
              </div>
              {advanced && !submitted && (
                <div className="surface surface-pad" style={{ marginTop: 20 }}>
                  <div className="section-label">
                    <strong>{getFormTitle()}</strong>
                    <span className="eyebrow">{batch.latestStage} handover</span>
                  </div>
                  {getFormDescription() && (
                    <div style={{ fontSize: 12, color: 'hsl(var(--muted-foreground))', marginBottom: 15 }}>
                      {getFormDescription()}
                    </div>
                  )}
                  {renderForm()}
                </div>
              )}
            </div>
          </aside>
        </div>
        <div
          className="rule"
          style={{ marginTop: 30, paddingTop: 18, fontSize: 11, color: 'hsl(var(--muted-foreground))' }}
        >
          <strong>Evidence boundary.</strong> A valid chain proves the stored record has not changed after server
          acceptance. It does not prove that the first physical entry was truthful.
        </div>
      </main>
    </Shell>
  );
}

function Operations() {
  const [query, setQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('Inspector');
  const roles = [['Inspector', 'Review and accept handovers'], ['Landing agent', 'Confirm the first receipt'], ['Buyer', 'Check before purchase'], ['Regulator', 'Monitor the chain']];
  const matches = useMemo(() => demoBatches.filter(batch => `${batch.publicId} ${batch.species} ${batch.landingSite}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return <Shell><main className="shell page-main"><PageHead eyebrow="Operations / Entry point" title="Make the next handover clear."><p>Search a batch, read its current stage, and continue the chain from the place where work is happening.</p></PageHead><div className="role-grid">{roles.map(([role, desc]) => <button className={`role-card ${selectedRole === role ? 'selected' : ''}`} key={role} onClick={() => setSelectedRole(role)} data-testid={`button-role-${role.toLowerCase().replace(' ', '-')}`}><strong>{role}</strong><span>{desc}</span></button>)}</div><div className="surface surface-pad" style={{ marginTop: 30 }}><div className="section-label"><strong>{selectedRole} lookup</strong><span className="status-line"><span className="status-dot" /> Field console ready</span></div><div style={{ display: 'flex', gap: 10, marginBottom: 25 }}><div style={{ flex: 1, position: 'relative' }}><Search size={15} style={{ position: 'absolute', left: 13, top: 13, color: 'hsl(var(--muted-foreground))' }} /><input className="lookup-input" style={{ paddingLeft: 38 }} placeholder="Search public ID, species, or landing site" value={query} onChange={e => setQuery(e.target.value)} aria-label="Search operations" data-testid="input-operations-search" /></div><button className="pill" onClick={() => setQuery('')} data-testid="button-clear-search">Clear</button></div>{matches.length === 0 ? <div className="empty-state"><Search size={25} /><h2>No batches found</h2><p>Try another public ID or landing site.</p></div> : matches.map(batch => <div className="list-row" key={batch.publicId}><div><strong>{batch.publicId}</strong><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{batch.species} · {batch.landingSite}</div></div><span>{batch.weightKg} kg</span><span className="badge">{batch.latestStage}</span><Link href={`/batch/${batch.publicId}`} className="pill" style={{ justifyContent: 'center', padding: '8px 11px' }} data-testid={`link-open-batch-${batch.publicId}`}><span>Open</span><ArrowRight size={13} /></Link></div>)}</div></main></Shell>;
}

function Dashboard() {
  const [filter, setFilter] = useState('All stages');
  const visible = filter === 'All stages' ? demoBatches : demoBatches.filter(batch => batch.latestStage === filter);
  const totalWeight = demoBatches.reduce((sum, batch) => sum + batch.weightKg, 0);
  const counts = stages.map(stage => ({ stage, count: demoBatches.filter(batch => batch.latestStage === stage).length }));
  return <Shell><main className="shell page-main"><PageHead eyebrow="Admin overview / 18 June 2025" title="The lake, at a glance."><p>A measured view of active chains across the Lake Victoria network. Filters are local to this session.</p></PageHead><div className="metric-grid"><div className="surface metric"><div className="eyebrow">Total batches</div><div className="stat-value">1,284</div><div className="status-line"><span className="gold">+8.4%</span> vs last week</div></div><div className="surface metric"><div className="eyebrow">Total weight</div><div className="stat-value">{(totalWeight + 11780).toLocaleString()} <small style={{ fontFamily: 'var(--app-font-sans)', fontSize: 12 }}>kg</small></div><div className="status-line">accepted this period</div></div><div className="surface metric"><div className="eyebrow">Active chains</div><div className="stat-value">417</div><div className="status-line"><span className="status-dot" /> across 12 sites</div></div><div className="surface metric"><div className="eyebrow">Verified proofs</div><div className="stat-value">98.7%</div><div className="status-line"><ShieldCheck size={13} className="gold" /> integrity intact</div></div></div><div className="dashboard-grid"><section className="surface surface-pad"><div className="section-label"><strong>Daily volume</strong><span className="eyebrow">Last 7 days · kg</span></div><div className="bars">{[61, 82, 49, 73, 91, 67, 77].map((height, i) => <div className="bar-col" key={i}><div className="bar" style={{ height: `${height}%` }} /><small>{['12', '13', '14', '15', '16', '17', '18'][i]} Jun</small></div>)}</div><div className="status-line" style={{ marginTop: 15 }}><span className="status-dot gold-dot" /> Volume peaks on landing days with early morning intake.</div></section><section className="surface surface-pad"><div className="section-label"><strong>Stage distribution</strong><span className="eyebrow">Current stage</span></div>{counts.map(({ stage, count }) => <div className="location-bar" key={stage}><span style={{ width: 75 }}>{stage}</span><div><i style={{ width: `${Math.max(10, count / 4 * 100)}%` }} /></div><span className="mono" style={{ fontSize: 10, width: 28, textAlign: 'right' }}>{count}</span></div>)}<div className="rule" style={{ paddingTop: 15, marginTop: 20, fontSize: 11, color: 'hsl(var(--muted-foreground))' }}>Chains move in one direction: Catch → Landing → Transport → Processing → Market.</div></section></div><section className="surface surface-pad"><div className="section-label"><strong>Recent catch records</strong><div style={{ display: 'flex', gap: 9, alignItems: 'center' }}><select className="lookup-input" style={{ width: 'auto', padding: '8px 11px', fontSize: 11 }} value={filter} onChange={e => setFilter(e.target.value)} aria-label="Filter by stage" data-testid="select-dashboard-filter"><option>All stages</option>{stages.map(stage => <option key={stage}>{stage}</option>)}</select><span className="eyebrow">{visible.length} shown</span></div></div><div className="list-row list-head"><span>Public ID / species</span><span>Weight</span><span>Stage</span><span>Open</span></div>{visible.map(batch => <div className="list-row" key={batch.publicId}><div><strong>{batch.publicId}</strong><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{batch.species} · {dateLabel(batch.catchDateTime)}</div></div><span>{batch.weightKg} kg</span><span className="badge verified">{batch.latestStage}</span><Link href={`/batch/${batch.publicId}`} className="status-line" data-testid={`dashboard-open-${batch.publicId}`}>Inspect <ArrowRight size={13} /></Link></div>)}</section></main></Shell>;
}

function Foundations() {
  const [open, setOpen] = useState('boundary');
  const items = [
    ['boundary', 'The evidence boundary', 'A valid chain proves that the stored record has not changed after server acceptance. It does not prove that the first physical entry was truthful. LakeProof makes that distinction visible rather than hiding it behind a trust badge.'],
    ['integrity', 'Integrity, in plain terms', 'Each accepted event carries its own hash and the hash of the event before it. If a stored value changes later, the sequence no longer resolves. The chain is an audit trail, not a claim of perfect reality.'],
    ['lifecycle', 'One fixed lifecycle', 'Every record follows the same five-stage path: Catch, Landing, Transport, Processing, Market. Teams can add an event at the next stage; they cannot rewrite the stage that came before.'],
    ['roles', 'Role boundaries', 'Fishers and landing-site agents establish the first record. Inspectors and operators accept handovers. Buyers and regulators verify what was accepted. Consumers see a deliberately redacted public view.']
  ];
  return <Shell><main className="shell page-main"><PageHead eyebrow="Foundations / How it works" title="A record with edges."><p>LakeProof is designed around a simple promise: show what the system knows, show where that knowledge begins, and never pretend the ledger can replace the people who work the lake.</p></PageHead><div className="story-grid rule" style={{ paddingTop: 55 }}><div><div className="eyebrow">The working principle</div><h2>Useful trust is specific.</h2><p>Good provenance is not a vague feeling. It is a sequence of accepted moments, with enough context for the next person to make a better decision.</p></div><div><img src="/images/crew.jpg" alt="Fishers preparing a net beside a wooden boat on Lake Victoria" style={{ width: '100%', height: 280, objectFit: 'cover', objectPosition: 'center 64%', filter: 'saturate(.72)' }} /><div className="eyebrow" style={{ marginTop: 10 }}>Lake Victoria · shared context, local evidence</div></div></div><section className="surface surface-pad" style={{ marginTop: 20 }}>{items.map(([id, title, copy]) => <div className="accordion" key={id}><button onClick={() => setOpen(open === id ? '' : id)} data-testid={`button-foundation-${id}`}><span style={{ display: 'flex', gap: 18, alignItems: 'center' }}><span className="mono gold">0{items.findIndex(item => item[0] === id) + 1}</span><strong style={{ fontFamily: 'var(--app-font-serif)', fontSize: 24, fontWeight: 500 }}>{title}</strong></span><ChevronDown size={17} style={{ transform: open === id ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} /></button>{open === id && <div className="accordion-content">{copy}</div>}</div>)}</section><section className="dark-band" style={{ marginTop: 55 }}><div className="shell" style={{ padding: '65px 0' }}><div className="eyebrow" style={{ color: 'hsl(var(--accent))' }}>The commitment</div><div className="quote" style={{ maxWidth: 700, marginTop: 18, borderColor: 'hsl(var(--accent))', color: 'hsl(var(--primary-foreground))' }}>“The strongest record is not the one that says everything is certain. It is the one that tells you exactly what is known.”</div></div></section></main></Shell>;
}

function NotFound() {
  return <div className="paper not-found"><div><Brand /><h1>404</h1><p style={{ color: 'hsl(var(--muted-foreground))', marginBottom: 25 }}>This page drifted beyond the shoreline.</p><Link href="/" className="pill pill-solid" data-testid="link-not-found-home"><ArrowLeft size={14} /> Return to LakeProof</Link></div></div>;
}

function Router() {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}><Switch>
    <Route path="/" component={Home} />
    <Route path="/register-fisher" component={RegisterFisher} />
    <Route path="/register-catch" component={RegisterCatch} />
    <Route path="/register" component={RegisterFisher} />
    <Route path="/verify" component={Verify} />
    <Route path="/verify/:id" component={() => <Proof />} />
    <Route path="/operations" component={Operations} />
    <Route path="/batch/:id" component={() => <Proof operations />} />
    <Route path="/dashboard" component={Dashboard} />
    <Route path="/foundations" component={Foundations} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch></ErrorBoundary>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><Router /><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;