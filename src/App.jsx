import { useState, useEffect, useMemo } from 'react';
import Intro from './components/Intro';
import Login from './components/Login';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import FilterBar from './components/FilterBar';
import TodoList from './components/TodoList';
import Stats from './components/Stats';
import RandomPopup from './components/RandomPopup';
import todoApi from './api/todoApi';
import './App.css';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [actionCount, setActionCount] = useState(0);
  const [popupEnabled, setPopupEnabled] = useState(false);

  // 액션 트리거 (랜덤 팝업용)
  const triggerAction = () => {
    if (popupEnabled) {
      setActionCount(prev => prev + 1);
    }
  };

  // Fetch todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.getAll();
      setTodos(data);
    } catch (err) {
      setError('할 일 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (todoData) => {
    triggerAction();
    try {
      const newTodo = await todoApi.create(todoData);
      setTodos(prev => [newTodo, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('할 일 추가에 실패했습니다.');
      console.error(err);
    }
  };

  const handleToggle = async (id) => {
    triggerAction();
    try {
      const updated = await todoApi.toggleComplete(id);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('상태 변경에 실패했습니다.');
      console.error(err);
    }
  };

  const handleUpdate = async (id, todoData) => {
    triggerAction();
    try {
      const updated = await todoApi.update(id, todoData);
      setTodos(prev => prev.map(t => t.id === id ? updated : t));
    } catch (err) {
      setError('수정에 실패했습니다.');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    triggerAction();
    try {
      await todoApi.delete(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError('삭제에 실패했습니다.');
      console.error(err);
    }
  };

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let result = [...todos];

    // Apply filter
    if (filter === 'completed') {
      result = result.filter(t => t.completed);
    } else if (filter === 'pending') {
      result = result.filter(t => !t.completed);
    } else if (filter === 'high') {
      result = result.filter(t => t.priority === 'HIGH' && !t.completed);
    }

    // Apply search
    if (searchKeyword.trim()) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(keyword) ||
        (t.description && t.description.toLowerCase().includes(keyword))
      );
    }

    return result;
  }, [todos, filter, searchKeyword]);

  if (showIntro) {
    return <Intro onComplete={() => setShowIntro(false)} />;
  }

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div id="app" className="app" role="application" aria-label="TODO 앱">
      <Header
        popupEnabled={popupEnabled}
        onTogglePopup={() => setPopupEnabled(prev => !prev)}
      />

      <main id="main-content" className="main-content" role="main">
        <div className="container">
          {error && (
            <div
              id="error-banner"
              className="error-banner fade-in"
              role="alert"
              aria-live="assertive"
            >
              <span id="error-message">{error}</span>
              <button
                id="error-dismiss-btn"
                onClick={() => setError(null)}
                aria-label="오류 메시지 닫기"
              >
                ×
              </button>
            </div>
          )}

          <Stats todos={todos} filter={filter} onFilterChange={setFilter} />

          <div id="add-todo-section" className="add-todo-section">
            {!showForm ? (
              <button
                id="add-todo-btn"
                className="btn-add-todo"
                onClick={() => setShowForm(true)}
                aria-label="새 할 일 추가 폼 열기"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                새 할 일 추가
              </button>
            ) : (
              <div id="todo-form-wrapper" className="form-wrapper fade-in">
                <TodoForm
                  onSubmit={handleCreate}
                  onCancel={() => setShowForm(false)}
                />
              </div>
            )}
          </div>

          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            searchKeyword={searchKeyword}
            onSearchChange={setSearchKeyword}
          />

          <TodoList
            todos={filteredTodos}
            onToggle={handleToggle}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>
      </main>

      <RandomPopup triggerCount={actionCount} />
    </div>
  );
}

export default App;
