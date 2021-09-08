# IOUApp - { API }

- **Technologies**
    - Git/GitHub
    - NodeJs
    - TypeScript
    - ExpressJS
    - Winston → Logger
    - MongoDB → mongoose
- **Architecture → Model DAO Service Controller**
    - **api** → root directory
        - **dist** → production build
        - **logger** → custom logs
        - **src** → main entry

            Flow |- model → dao → service → controller → app

            - types → interfaces
            - model → MongoDB (Schema) Documents
            - dao → data access object
            - service → should be tested
            - controller → routes
            - app.ts → server

## Routes

[ GET ] Home ' / ' route redirects to ' /healthcheck ' → for checking API's current status

[ GET | POST ] ' users/ ' → get all users | create new user

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "doe@gmail.com",
  "password": "123456789"
}
```

[ GET ] ' users/login/:user_email/:password ' → login user

[ GET | DELETE ] ' users/user_email ' → get and delete user by user's email

[ GET | POST ] ' debtcards/ ' → get all debtcards | create new debtcard

```json
{
  "payer": "john@gmail.com",
  "receiver": "doe@gmail.com",
  "reason": "food & drink",
  "amount": 21.25
}
```

[ GET ] ' debtcards/users/:user_email?debt=payer || receiver ' → get all debtcards for user by filtering what the user has to pay or what is owed to the user

```
Example: debtcards/users/doe@gmail.com?debt=payer
                           Or
Example: debtcards/users/doe@gmail.com?debt=receiver
```

[ GET | PUT ] ' debtcards/:debtcard_id?paid=true || false ' → get debtcards by id,  update payment status

```
GET: http://localhost:3000/debtcards/61319824c6d622bc31899bd2

PUT: http://localhost:3000/debtcards/61319824c6d622bc31899bd2?paid=true
```

[ GET ] ' debtcards/users/:user_email/paid'  → get debtcards paid to, or by user

## Installation

```bash
npm i
// development environment
npm run dev
// production environment
npm run start
```

## Hosting

1. Update and upgrade linux
2. Install nodejs and nvm
3. Install and setup nginx

    ```bash
    sudo apt install nginx
    sudo vi /etc/nginx/sites-available/default
    ```

    ```
    server_name yourdomain.com or ipaddress;

    location / {
        proxy_pass http://0.0.0.0:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
    ```

    ```bash
    sudo nginx -t
    sudo service nginx restart
    ```

4. Install pm2 globally 

    ```bash
    npm i #inside of IOUAPP_API dir
    sudo npm i pm2 -g
    ```

5. Install and setup SSL

    ```bash
    sudo add-apt-repository ppa:certbot/certbot
    sudo apt-get update
    sudo apt-get install python3-certbot-nginx
    sudo certbot --nginx -d yourdomain.com
    ```

6. Run in production

    ```bash
    npm run prod
    ```

## Contributors

- [matxa](https://github.com/matxa)
- [chriswill88](https://github.com/chriswill88)

## License

- ISC

---

[See a web version of this document.](https://api.iamramos.tech/iouapp_api)
