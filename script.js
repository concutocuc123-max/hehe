// Lưu và tải danh sách Todo với localStorage
const todoInput = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoForm = document.getElementById('todo-form');
const todoList = document.getElementById('todo-list');
const darkToggle = document.getElementById('dark-toggle');

let todos = [];

function loadTodos() {
    const stored = localStorage.getItem('todos');
    todos = stored ? JSON.parse(stored) : [];
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';
    todos.forEach((todo, idx) => {
        const li = document.createElement('li');
        li.textContent = todo;

        // Xử lý thêm animation cho remove
        const rmBtn = document.createElement('button');
        rmBtn.textContent = '×';
        rmBtn.className = 'remove-btn';
        rmBtn.onclick = () => removeTodo(idx, li);

        li.appendChild(rmBtn);
        todoList.appendChild(li);
    });
}

function removeTodo(idx, li) {
    // Thêm class để animate out trước khi xóa trên datas
    li.classList.add('removing');
    setTimeout(() => {
        todos.splice(idx, 1);
        saveTodos();
        renderTodos();
    }, 350); // Thời gian đúng với animation CSS
}

// Thêm todo với hiệu ứng animate in tự nhiên
function addTodo(val) {
    todos.push(val);
    saveTodos();
    renderTodos();
    // Animate todo vừa thêm
    const lastLi = todoList.lastElementChild;
    if (lastLi) {
        lastLi.classList.add('newly-added');
        setTimeout(() => lastLi.classList.remove('newly-added'), 600);
    }
}

todoForm.addEventListener('submit', e => {
    e.preventDefault();
    const val = todoInput.value.trim();
    if (val) {
        addTodo(val);
        todoInput.value = '';
        todoInput.focus();
    }
});

todoInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        addBtn.click();
    }
});

// Dark mode logic
function updateDarkMode(theme) {
    document.body.classList.toggle('dark', theme === 'dark');
}
function getPreferredTheme() {
    // kiểm tra localStorage trước, nếu không thì prefer media
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || saved === 'light') return saved;
    // auto detect bằng hệ thống
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
function toggleTheme() {
    const curr = document.body.classList.contains('dark') ? 'dark' : 'light';
    const next = curr === 'dark' ? 'light' : 'dark';
    updateDarkMode(next);
    localStorage.setItem('theme', next);
}
if (darkToggle) {
    darkToggle.addEventListener('click', toggleTheme);
}
// Khởi tạo theme khi load
updateDarkMode(getPreferredTheme());

loadTodos();
