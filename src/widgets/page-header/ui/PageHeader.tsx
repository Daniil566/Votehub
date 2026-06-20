export function PageHeader() {
  return (
    <header className="page-header">
      <div>
        <p className="section-label">VoteHub</p>
        <h1>Голосование за проектные идеи</h1>
        <p>Участники предлагают идеи, а администратор одобряет заявки перед общим голосованием.</p>
      </div>
      <aside className="hero-note">
        <strong>Идеи проходят модерацию</strong>
        <p>Обычный участник отправляет проект на проверку, а администратор допускает его к голосованию.</p>
      </aside>
    </header>
  );
}
