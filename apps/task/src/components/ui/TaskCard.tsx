const TaskCard = ({
  title,
  count,
  description,
}: {
  title: string;
  count: number;
  description: string;
}) => (
  <div
    style={{
      background: 'rgba(182, 137, 56, 0.1)',
      border: '1px solid rgba(182, 137, 56, 0.3)',
      borderRadius: '12px',
      padding: '1.5rem',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
    }}
  >
    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
    <p
      style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        color: '#b68938',
        marginBottom: '0.5rem',
      }}
    >
      {count}
    </p>
    <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>
      {description}
    </p>
  </div>
);

export default TaskCard;
