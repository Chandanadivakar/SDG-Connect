import type { Entity } from '../lib/types'

export function EntityCard({
  entity,
  actions,
  showFocusTags = true,
}: {
  entity: Entity
  actions?: React.ReactNode
  showFocusTags?: boolean
}) {
  const mapQuery =
    entity.latitude != null && entity.longitude != null
      ? `${entity.latitude},${entity.longitude}`
      : `${entity.city}, ${entity.state}`
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}`

  return (
    <div className="card soft">
      <div className="row gap-md" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div>
          <div className="row gap-sm" style={{ flexWrap: 'wrap' }}>
            <span className="tag">{entity.kind}</span>
            <span className="tag">
              {entity.city}, {entity.state}
            </span>
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, marginTop: 8 }}>{entity.name}</div>
          <div className="muted tiny" style={{ marginTop: 6 }}>
            <a href={`mailto:${entity.email}`}>{entity.email}</a>
            {entity.phone ? <> • {entity.phone}</> : null}
            {entity.website ? (
              <>
                {' '}
                •{' '}
                <a href={entity.website} target="_blank" rel="noreferrer">
                  {entity.website}
                </a>
              </>
            ) : null}
            {' '}
            •{' '}
            <a href={mapUrl} target="_blank" rel="noreferrer">
              Open map
            </a>
          </div>
        </div>
        <div className="row gap-sm">{actions}</div>
      </div>

      <div className="muted" style={{ marginTop: 10 }}>
        {entity.about}
      </div>

      {showFocusTags ? (
        <div className="row gap-sm" style={{ marginTop: 10, flexWrap: 'wrap' }}>
          {entity.focus.map((sdg) => (
            <span className="tag" key={sdg}>
              {sdg}
            </span>
          ))}
        </div>
      ) : null}

      <div className="grid-2" style={{ marginTop: 10 }}>
        <div>
          <div className="muted tiny">Offers</div>
          <div className="muted tiny" style={{ marginTop: 6 }}>
            {(entity.resourcesOffered ?? []).length ? (entity.resourcesOffered ?? []).join(' • ') : '—'}
          </div>
        </div>
        <div>
          <div className="muted tiny">Needs</div>
          <div className="muted tiny" style={{ marginTop: 6 }}>
            {(entity.resourcesNeeded ?? []).length ? (entity.resourcesNeeded ?? []).join(' • ') : '—'}
          </div>
        </div>
      </div>
    </div>
  )
}

