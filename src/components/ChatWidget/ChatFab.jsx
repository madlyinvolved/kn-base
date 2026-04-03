const fabStyle = {
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  width: '56px',
  height: '56px',
  borderRadius: '50%',
  background: 'var(--color-accent)',
  color: 'white',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.5rem',
  boxShadow: 'var(--shadow-lg)',
  transition: 'all var(--transition-normal)',
  zIndex: 1000,
}

export default function ChatFab({ isOpen, onClick }) {
  return (
    <button
      style={fabStyle}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'
      }}
      aria-label={isOpen ? 'Закрыть чат' : 'Открыть AI-ассистент'}
    >
      {isOpen ? '✕' : '💬'}
    </button>
  )
}
