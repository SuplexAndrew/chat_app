Данный проект результат работы над тестовым функционалом
Стек: NodeJS(express), SocketIO, React, PostgreSQL

Все важные методы для работы с чатом выделенны в контроллер. Взаимодействие пользователя проходит в основном через сокеты. В мидлвэйре создается соединение и обрабатываются события сервера(аутентификация пользователя, выдача ему связанных с ним сообщений и настроек чата), а также события юзера(отправка сообщения). 
Дополнительно на основе контроллера создан API, с которым взаимодействуют сотрудники сайта(операторы и админы).

Выполненные основные требования:
- Чат должен узнавать посетителя, зашедшего на сайт повторно и отображать его
историю переписки (если есть)
// в localStorage сохраняется токен, который предоставляется при повторном посещении
- Операторская часть должна представлять из себя API, включающий методы для
ведения диалогов (получение списка диалогов, получение списка сообщений в
диалоге, отправка сообщения в диалог и пр.)
// файл adminApi.js
- Механизм встраивания на сайт должен быть простым и понятным
// встраивается через iframе, есть роут('/getIframe/:id'), который возвращает элемент iframе
- Настраиваемые автоматические приветственные сообщения.
// новым посетителям выдается сообщение "Здравствуйте, чем могу вам помочь?"
- Работа в API с использованием авторизации
// Авторизация на основе JWT 
- Реализовать возможность настроек:
- Адрес сайта, куда чат будет встраиваться (при попытке встроить на
другой сайт он работать не должен)
// хранится жсон с доступными сайтами
- Настройки внешнего вида: цвета различных элементов, текст
заголовков/плейсхолдеров и пр. - набор настроек на своё усмотрение
// хранится жсон с заданными настройками
- Администраторская часть должна представлять из себя API, включающий
методы просмотра и управления настройками
- Web-интерфейс оператора, для ведения диалогов (на основе реализованного
API)


