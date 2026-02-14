import './Header.css';

function Header({ popupEnabled, onTogglePopup, onLogout }) {
  return (
    <header id="app-header" className="header" role="banner">
      <div className="header-content">
        <div className="logo" id="logo">
          <span className="logo-icon" id="logo-icon" aria-hidden="true">✓</span>
          <h1 id="app-title">TODO</h1>
        </div>

        <div className="header-actions">
          <button
            id="popup-toggle-btn"
            className={`popup-toggle ${popupEnabled ? 'active' : ''}`}
            onClick={onTogglePopup}
            aria-label={`랜덤 팝업 ${popupEnabled ? '끄기' : '켜기'}`}
            aria-pressed={popupEnabled}
          >
            <span className="toggle-icon" aria-hidden="true">
              {popupEnabled ? '🔔' : '🔕'}
            </span>
            <span className="toggle-label">팝업</span>
            <span
              id="popup-toggle-status"
              className={`toggle-status ${popupEnabled ? 'on' : 'off'}`}
            >
              {popupEnabled ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            id="logout-btn"
            className="logout-btn"
            onClick={onLogout}
            aria-label="로그아웃"
          >
            <span className="logout-icon" aria-hidden="true">⏻</span>
            <span className="logout-label">로그아웃</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
