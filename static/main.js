class Profile {
  constructor({ username, name: { firstName, lastName }, password }) {
    this.username = username;
    this.name = {
      firstName,
      lastName,
    };
    this.password = password;

    this.status = false;
    this.money = false;
  }

  createUser(callback) {
    return ApiConnector.createUser({ username: this.username, name: this.name, password: this.password }, (err, data) => {
      console.log(`Пользователь ${this.name.firstName} создан`);
      callback(err, data);
    });
  }
  authorize(callback) {
    return ApiConnector.performLogin(
      { username: this.username, password: this.password },
      (err, data) => {
        console.log(`Пользователь ${this.name.firstName} авторизован`);
        callback(err, data);
      }
    );
  }

  addMoney({ currency, amount }, callback) {
    return ApiConnector.addMoney({ currency, amount }, (err, data) => {
      console.log(`Зачисленно ${amount} ${currency}`);
      callback(err, data);
    });
  }

  transferMoney({ to, amount }, callback) {
    return ApiConnector.transferMoney({ to, amount }, (err, data) => {
      console.log(`Переведено ${amount} пользователю ${to} `);
      callback(err, data);
    });
  }

  convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
    return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
      console.log(`Конвертация ${fromCurrency} в ${targetAmount} ${targetCurrency}`);
      callback(err, data);
    });
  }

  getStocks(callback) {
    return ApiConnector.getStocks((err, data) => {
      console.log(`Текущий курс`);
      callback(err, data);
    });
  }
}

function main() {
  let user = new Profile({
    username: 'Ivan',
    name: { firstName: 'Ivan', lastName: 'Ivanov' },
    password: 'gfhj'
  });


  user.createUser((err, data) => {
    if (err) {
      if (err.code === 409) {
        user.authorize((err, data) => {
          if (err) {
            console.error('Не авторизован');
          } else {
            user.status = true;
            //console.log(`Авторизован ${username}`);
          }
        });
      }
    } else {
      user.status = true;
      console.log(`Создан пользователь ${user.name.firstName}`);
    }
  });

  let user2 = new Profile({
    username: 'petr',
    name: { firstName: 'Petr', lastName: 'Petrov' },
    password: 'ivanspass',
  });

  user2.createUser((err, data) => {
    if (err) {
      if (err.code === 409) {
        user2.authorize((err, data) => {
          if (err) {
            console.error('Не авторизован');
          } else {
            user2.status = true;
            //console.log(`Авторизован ${username}`);
          }
        });
      }
    } else {
      user2.status = true;
      console.log(`Создан пользователь  ${user2.name.firstName}`);
    }
  });

  user2.addMoney({ currency: 'RUB', amount: 500000 }, (err, data) => {
    if (err) {
      console.error(`Ошибка при зачислении денег на счет пользователю ${user2.name.firstName}`);
    } else {
      console.log(`Зачисленно 500000 руб на счет пользователю ${user2.name.firstName}`);
      user2.money = true;
    }
  });

  let timer1 = setInterval(() => {
    user2.addMoney({ currency: 'RUB', amount: 500000 }, (err, data) => {
      if (err) {
        console.error(`Ошибка при зачислении денег на счет пользователю ${user2.name.firstName}`);
      } else {
        console.log(`Зачисленно 500000 руб на счет пользователю ${user2.name.firstName}`);
        user2.isMoney = true;
      }
    });
    user2.convertMoney({ fromCurrency: 'RUB', targetCurrency: 'NETCOIN', targetAmount: 100 }, (err, data) => {
      if (err) {
        console.log(err.message);
      } else {
        //console.log(`Конвертация рубля в 100 ${targetCurrency}`);
      }
    });

    user2.transferMoney({ to: 'ivan', amount: 100 }, (err, data) => {
      if (err) {
        console.error(err.code);
        console.error(err.message);
      } else {
        //console.log(`переведино 100 пользователю `);
      }
    });

    user2.getStocks((err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data[0]);
      }
    });
    clearInterval(timer1);
  }, 1000);
}