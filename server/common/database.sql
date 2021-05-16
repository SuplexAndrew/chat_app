create table Status (
	id SERIAL PRIMARY KEY,
    name varchar(255)
);
create table User_ (
	id SERIAL PRIMARY KEY,
	token varchar(255),
	visit_time timestamp,
	FOREIGN KEY (role_id) references Role(id)
);
create table Message (
	id SERIAL PRIMARY KEY,
	text text,
	time_ timestamp,
	status_id integer,
	user_id integer,
	sent_by_user boolean,
	FOREIGN KEY (status_id) references Status(id),
	FOREIGN KEY (user_id) references User_(id)
);
create table Admin() {
    id SERIAL PRIMARY KEY,
    login varchar(32),
    password varchar(32),
    salt varchar(32)
}
insert into Status (name) values
('Отправлено'),('Доставлено'),('Прочитано');
insert into message (text, time_, status_id, user_id) values
('hello', current_timestamp, 3, 19),('how are you?', current_timestamp, 3, 19);

