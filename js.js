function DataTable(config) {
    let url = config.apiUrl;
    fetch(url).then(response => response.json()).then(data => {
    
        let parent = document.querySelector(config1.parent);
        let table = document.createElement('table');

        //Кнопка добавления
        let addBtn = document.createElement('button');
        addBtn.textContent = 'Добавить';
        addBtn.style.display = 'block';
        addBtn.style.margin = '0 auto';
        parent.appendChild(addBtn);

        addBtn.addEventListener('click', () => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            let input = document.createElement('input');
            input.type = 'text';
            td.appendChild(input);
            tr.appendChild(td);

            for (let i = 0; i < config.columns.length; i++) {
                td = document.createElement('td');
                input = document.createElement('input');
                input.type = 'text';
                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') checkInput();
                });

                if (i != config.columns.length - 1) {
                    td.appendChild(input);
                }
                else {
                    let btn = document.createElement('button');
                    btn.textContent = 'Добавить';
                    btn.style.color = 'green';
                    btn.addEventListener('click', checkInput);
                    td.appendChild(btn);
                }
                tr.appendChild(td);
            }
            document.querySelector('#usersTable tr:nth-child(1)').after(tr);
            addBtn.style.display = 'none';

            function checkInput()
            {
                let flag = true;
                let inputs = document.querySelectorAll('#usersTable input[type="text"]');
                let obj = {}
                for (let j = 0; j < config.columns.length - 1; j++) {
                    obj[config.columns[j].value] = inputs[j+1].value;
                    if (inputs[j+1].value.length < 3) {
                        flag = false;
                        inputs[j+1].style.border = '1px solid red';
                    }
                    else {
                        inputs[j+1].style.border = '1px solid black';
                    }
                }
                if(flag) {
                    alert('Информация отправлена на сервер!');
                    fetch(config.apiUrl, 
                        {
                            method: 'POST', // или 'PUT'
                            body: JSON.stringify(obj),
                            headers: {'Content-Type': 'application/json'}
                        }
                    ).then(() => {
                        window.location.reload(); // Как сделать без перезакрузки?
                    });
                } else {
                    alert('Не все поля заполнены!');
                }
            }
        });

        let head_tr = document.createElement('tr');
        let th = document.createElement('th');
        th.innerHTML = "ID";
        head_tr.appendChild(th);

        for (let i = 0; i < config.columns.length; i++) {
            let th = document.createElement('th');
            th.innerHTML = config.columns[i].title;
            head_tr.appendChild(th);
        }
        table.appendChild(head_tr);
        
        for (key in data.data) {
            let tr = document.createElement('tr');

            //Добавим в первый столбец id
            let td1 = document.createElement('td');
            td1.innerHTML = key;
            tr.appendChild(td1);

            for (let j = 0; j < config.columns.length; j++) {
                let td = document.createElement('td');
                // По ссылкам нет картинкок(
                // if (data.data[key][config.columns[j].value].startsWith('https://')) {
                //     let img = document.createElement('img');
                //     img.src = data.data[key][config.columns[j].value];
                //     td.appendChild(img);
                // }
                if (j != config.columns.length - 1) {
                    td.innerHTML = data.data[key][config.columns[j].value]
                } 
                //Добавим кнопку удаления
                else {
                    let deleteBtn = document.createElement('button');
                    deleteBtn.textContent = 'Удалить'
                    deleteBtn.style.color = 'red';
                    deleteBtn.setAttribute('data-id', key);
                    td.appendChild(deleteBtn);

                    //Вешаем событье на каждую кнопку
                    deleteBtn.addEventListener('click', (e) => {
                        let id = e.target.dataset.id;
                        fetch(config.apiUrl + '/' + id, 
                        {
                            method: 'DELETE'
                        }).then(() => {
                            window.location.reload(); // Как сделать без перезакрузки?
                        });
                    });
                }
                tr.appendChild(td)
            }
            table.appendChild(tr);
        }
        parent.appendChild(table);
    })
   
}
 
const config1 = {
    parent: '#usersTable',
    columns: [
     {title: 'Имя', value: 'name'},
     {title: 'Фамилия', value: 'surname'},
     {title: 'Аватар', value: 'avatar'},
     {title: 'День рождение', value: 'birthday'},
     {title: 'Действия', value: 'actions'},
   ],
   apiUrl: "https://mock-api.shpp.me/mtsurkan/users"
};
 
DataTable(config1);