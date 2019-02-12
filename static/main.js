class Profile {
    constuctor({username, name, lastName, password}) {
        this.username = username;
        this.name = name;
        this.lastName = lastName;
        this.password = password;

        this.status = false;
        this.money = false;
    }

    createUser(
        {
            username,
            name: { firstName, lastName },
            password,
        },
        callback
    ) {
        return ApiConnector.createUser({username, name: { firstName, lastName }, password}, (err, data) => {
            callback(err, data);
        });
    }

    performLogin({ username, password }, callback) {
        return ApiConnector.performLogin({ username, password }, (err, data) => {
            callback(err, data);
        });
    }

    addMoney({ currency, amount }, callback) {
        return ApiConnector.addMoney({ currency, amount }, (err, data) => {
            callback(err, data);
        });
    }

    transferMoney({ to, amount }, callback) {
        return ApiConnector.transferMoney({ to, amount }, (err, data) => {
            callback(err, data);
        });
    }

    convertMoney({ fromCurrency, targetCurrency, targetAmount }, callback) {
        return ApiConnector.convertMoney({ fromCurrency, targetCurrency, targetAmount }, (err, data) => {
            callback(err, data);
        });
    }

    getStocks(callback) {
       return ApiConnector.getStocks((err, data) => {
            callback(err, data);
       });
    }

    getStatus() {
        return this.status;
    }

    isMoney() {
        return this.money;
    }
}

function main(){
    const Oleg = new Profile({
                    username: 'oleg',
                    name: { firstName: 'oleg', lastName: 'Chernyshev' },
                    password: 'done'
                });


    Oleg.createUser({
                    username: 'oleg',
                    name: { firstName: 'oleg', lastName: 'Chernyshev' },
                    password: 'done'
                    }, (err, data) => {
        if (err) {
            if(err.code === 409) {
                Oleg.performLogin({ username: 'djon', password: 'djonspass' }, (err, data) => {
                    if (err) {
                        console.error(err.code);
                    } else {
                        this.status = true;
                        console.log(`Authoriing user Oleg`);
                    }
                });
            }
        } else {
            this.status = true;
            console.log(`Creating user Oleg`);
        }
    });

    const Ivan = new Profile({
                    username: 'djon',
                    name: { firstName: 'djon', lastName: 'Chernyshev' },
                    password: 'djonspass',
                });

    Ivan.createUser({
                    username: 'djon',
                    name: { firstName: 'djon', lastName: 'Chernyshev' },
                    password: 'djonspass',
                    }, (err, data) => {
        if (err.code === 409) {
            Ivan.performLogin({ username: 'djon', password: 'djonspass' }, (err, data) => {
                if (err) {
                    console.error(err.code);
                } else {
                    Ivan.status = true;
                    console.log(`Authoriing user Ivan`);
                }
            });
        } else {
            Ivan.status = true;
            console.log(`Creating user Ivan`);
        }
    });

    let timer1 = setInterval(() => {
        if(Ivan.getStatus()) {
            Ivan.addMoney({ currency: 'RUB', amount: 500000 }, (err, data) => {
                if (err) {
                    console.error('Error during adding money to Ivan');
                } else {
                    console.log(`Added 500000 rub to Ivan`);
                    Ivan.money = true;
                }
            });
            Ivan.convertMoney({ fromCurrency: 'RUB', targetCurrency: 'NETCOIN', targetAmount: 100 }, (err, data) => {
                if (err) {
                    console.log(err.message);
                } else {
                    console.log(`Converting RUB to 100 Netcoin`);
                }
            });

            Ivan.transferMoney({ to: 'oleg', amount: 100 }, (err, data) => {
                if (err) {
                    console.error(err.code);
                    console.error(err.message);
                } else {
                    console.log(`transfering 100 to Oleg`);
                }
            });

            Ivan.getStocks((err, data) => {
                if(err) {
                    console.error(err.message);
                } else {
                    console.log(data[0]);
                }
            });

            clearInterval(timer1);
        }
    }, 1000);
}

main()