import { ReactNode, useState } from 'react';
import { ArrowRight, Check, MapPin, Plus, Wifi } from 'lucide-react';
import { Link } from 'wouter';

type FisherRegistrationProps = {
  Shell: (props: { children: ReactNode; dark?: boolean }) => JSX.Element;
  PageHead: (props: { eyebrow: string; title: string; children?: ReactNode }) => JSX.Element;
};

type FisherSubmission = {
  fisherId: string;
  name: string;
  phone: string;
  vesselName: string;
};

export function FisherRegistration({ Shell, PageHead }: FisherRegistrationProps) {
  const [submitted, setSubmitted] = useState<FisherSubmission | null>(null);
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
                  Register catch <ArrowRight size={14} />
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
          <p>Create your blockchain identity. This record becomes the trusted source for every catch you record.</p>
        </PageHead>
        <div className="form-layout">
          <form className="surface surface-pad" onSubmit={submit}>
            {/* Personal Identity Section */}
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

            {/* Vessel and Gear Section */}
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

            {/* Blockchain Section */}
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

            {/* Consent and Submit */}
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 15, flexWrap: 'wrap' }}>
              <div className="status-line">
                <span className="status-dot" /> Saved locally · <Wifi size={13} /> Sync ready
              </div>
              <button className="pill pill-solid" type="submit" data-testid="button-submit-fisher">
                Create Fisher ID <ArrowRight size={14} />
              </button>
            </div>
          </form>

          {/* Sidebar Information */}
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
