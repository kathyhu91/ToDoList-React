import { useState, useEffect } from 'react';
import { Footer, Header, TodoCollection, TodoInput } from 'components';

import { getTodos, createTodo, patchTodo, deleteTodo } from 'api/todos';

import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext'; // 引用封裝好的資訊

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const todosNum = todos.length;

  const navigate = useNavigate();

  const { isAuthenticated, currentMember } = useAuth(); // 取出需要的狀態與方法

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  useEffect(() => {
    const getTodosAsync = async () => {
      try {
        const todos = await getTodos();
        setTodos(todos.map((todo) => ({ ...todo, isEdit: false })));
      } catch (error) {
        console.error(error);
      }
    };
    getTodosAsync();
  }, []);

  const handleChange = (value) => {
    setInputValue(value);
  };

  const handleAddTodo = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };
  const handleKeyDown = async () => {
    if (inputValue.length === 0) {
      return;
    }
    try {
      const data = await createTodo({
        title: inputValue,
        isDone: false,
      });
      setTodos((prevTodos) => {
        return [
          ...prevTodos,
          {
            id: data.id,
            title: data.title,
            isDone: data.isDone,
            isEdit: false,
          },
        ];
      });
      setInputValue('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleDone = async (id) => {
    const currentTodo = todos.find((todo) => todo.id === id);
    try {
      await patchTodo({
        id,
        isDone: !currentTodo.isDone,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return {
              ...todo,
              isDone: !todo.isDone,
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeMode = ({ id, isEdit }) => {
    setTodos((prevTodos) => {
      return prevTodos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            isEdit,
          };
        }

        return { ...todo, isEdit: false };
      });
    });
  };

  const handleSave = async ({ id, title }) => {
    try {
      await patchTodo({
        id,
        title,
      });
      setTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, title, isEdit: false };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      TodoPage
      <Header username={currentMember?.name} />
      <TodoInput
        inputValue={inputValue}
        onChange={handleChange}
        onAddTodo={handleAddTodo}
        onKeyDown={handleKeyDown}
      />
      <TodoCollection
        todos={todos}
        onSave={handleSave}
        onToggleDone={handleToggleDone}
        onChangeMode={handleChangeMode}
        onDelete={handleDelete}
      />
      <Footer todosNum={todosNum} />
    </div>
  );
};

export default TodoPage;
