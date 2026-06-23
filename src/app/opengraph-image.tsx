import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Best AI Tools — An honest index of working AI tools';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#f4efe1',
          padding: '64px 80px',
          position: 'relative',
          fontFamily: 'serif',
        }}
      >
        {/* Top flag */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '12px',
            background: '#e8480c',
            display: 'flex',
          }}
        />

        {/* Edition strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '20px',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: '#7b7464',
          }}
        >
          <div style={{ display: 'flex' }}>An independent index of AI software</div>
          <div style={{ display: 'flex' }}>200 entries · reviewed weekly</div>
        </div>
        <div style={{ display: 'flex', height: '2px', background: '#211d15', marginTop: '18px' }} />

        {/* Headline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              fontSize: '30px',
              letterSpacing: '6px',
              textTransform: 'uppercase',
              color: '#bd3a07',
              marginBottom: '24px',
            }}
          >
            Vol. 02 — The 2026 Edition
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '88px',
              fontWeight: 700,
              color: '#211d15',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            An honest index of
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '88px',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginTop: '6px',
            }}
          >
            <div style={{ display: 'flex', color: '#e8480c', fontStyle: 'italic' }}>working</div>
            <div style={{ display: 'flex', color: '#211d15' }}>&nbsp;AI tools.</div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: '2px solid #211d15',
            paddingTop: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'baseline' }}>
            <div style={{ display: 'flex', fontSize: '42px', fontWeight: 700, color: '#211d15' }}>
              Best AI Tools
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: '20px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: '#bd3a07',
                marginLeft: '16px',
                fontFamily: 'monospace',
              }}
            >
              The Index
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              letterSpacing: '2px',
              color: '#7b7464',
              fontFamily: 'monospace',
            }}
          >
            bestaitools4u.com
          </div>
        </div>
      </div>
    ),
    size,
  );
}
