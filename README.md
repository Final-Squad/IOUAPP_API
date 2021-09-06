# IOUApp - { API }

- **Technologies**
    - GitHub
        - GitHub Secrets
    - NodeJs
    - TypeScript
    - ExpressJS
    - Winston → Logger
    - Auth0
    - MongoDB → mongoose
- **Architecture → Model DAO Service Controller**
    - **api** → root directory
        - **dist** → build
        - **logger** → custom logs
        - **src** → main entry

            Flow |- model → dao → service → controller → app.ts

            - controller
            - dao → data access object
            - model → MongoDB (Schema) Documents
            - service → should be tested
            - types → interfaces
            - app.ts → server

## Routes

[ GET ] Home ' / ' route redirects to ' /healthcheck ' → for checking API's current status

[ GET | POST ] ' users/ ' → get all users | create new user

```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "doe@gmail.com"
}
```

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

## Contributors

- [matxa](https://github.com/matxa)
- [chriswill88](https://github.com/chriswill88)

## Licence

- ISC
