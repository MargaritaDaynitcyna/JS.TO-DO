(function () {
  //создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  //создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';
    button.disabled = true; //делаю кнопку невидимой

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);

    //делаю кнопку видимой при вводе
    input.addEventListener('input', function () {
      button.disabled = false
    });

    return {
      form,
      input,
      button,
    };
  }

  //создаем и возвращаем список элеме нтов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  //создаем и возвращаем элементы для списка дел
  function createTodoItem(name) {
    let item = document.createElement('li');
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    //устанавливаем стили для элемента спиака, а также для размещения кнопок
    //в его правой части с помощью flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-senter');
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    //вкладываем кнопки в отдельный элемент, чтобы они объединились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    }
  }


  function createTodoApp(container, title = 'Список дел', key) {

    // let container = document.getElementById('todo-app');
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();
    // let todoItems = [createTodoItem('хлеб'), createTodoItem('молоко')];
    let saved = [];

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    //проверка- есть ли что-то в localStorage?
    if (localStorage.getItem(key) !== null) {
      saved = JSON.parse(localStorage.getItem(key));
      console.log(saved);
      for (let i of saved) {
        let todoSaved = createTodoItem(i.name);
        todoList.append(todoSaved.item);
        if (i.done == true) {
          todoSaved.item.classList.toggle('list-group-item-success');
        }
        todoSaved.doneButton.addEventListener('click', function () {
          todoSaved.item.classList.toggle('list-group-item-success');
          if (i.done === false) {
            i.done = true
          } else {
            i.done = false
          };
          console.log(saved);
          localStorage.setItem(key, JSON.stringify(saved));
        });
        todoSaved.deleteButton.addEventListener('click', function () {
          if (confirm('Вы уверены?')) {
            todoSaved.item.remove();
            let index = saved.indexOf(i);
            saved.splice(index, 1);
            console.log(saved);
            localStorage.setItem(key, JSON.stringify(saved));
          }
        });
      }
    }

    //браузер создает событие submit  на форме по нажатию на энтер или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      //эта строчка необходима, чтобы предотвратить стандартное действие браузера
      //в данном случае мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();

      //игнорируем создание элемента, если пользователь ничего не ввел  в поле
      if (!todoItemForm.input.value) {
        return;
      }
      //заменим код добавления дела в список на тот, в котором
      //будут присутствовать обработчики события по кнопкам -->
      let todoItem = createTodoItem(todoItemForm.input.value);
      //добавляем  обаработчики на кнопки
      todoItem.doneButton.addEventListener('click', function () {
        todoItem.item.classList.toggle('list-group-item-success');
        if (obj.done === false) {
          obj.done = true
        } else {
          obj.done = false
        };
        console.log(saved);
        localStorage.setItem(key, JSON.stringify(saved));
      });
      todoItem.deleteButton.addEventListener('click', function () {
        if (confirm('Вы уверены?')) {
          todoItem.item.remove();
          let index = saved.indexOf(obj);
          saved.splice(index, 1);
          console.log(saved);
          localStorage.setItem(key, JSON.stringify(saved));
        }
      });

      //создаем и добавляем в список новое дело с названием из поля для ввода
      todoList.append(todoItem.item);

      //подготовка для localStorage
      let obj = {};
      obj.name = todoItemForm.input.value;
      obj.done = false;
      saved.push(obj);
      console.log(saved);

      //Сохранение данных
      localStorage.setItem(key, JSON.stringify(saved));

      //обнуляем значение в поле, стобы не стирать вручную
      todoItemForm.input.value = '';

      //делаю кнопку невидимой
      let button = document.querySelector('button');
      button.disabled = true;

    });
  }

  window.createTodoApp = createTodoApp;
})();
