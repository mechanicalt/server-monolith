# server-monolith

http://api.menternship.org

## Technologies
- [ ] hapijs
- [ ] postgres
- [ ] flowtype
- [ ] jest

## Setup

npm i

Create a .env file in root directory of project
PORT=8080
DATABASE_URL=postgres://you@localhost/menternship
JWT_SECRET=AnythingYouWant
SMTP_HOST=smtp.sendgrid.net
SMPT_PORT=587
SMTP_USERNAME=apikey
SMTP_PASSWORD=You'll need to create your own free account with sendgrid for dev purposes
BASE_URL=http://localhost:8080
CLIENT_URL=http://localhost:3000

// Run database migrations
npm run migrate up

// For development mode with stop points using VSCode
npm run debug

// For production mode 
npm start

## Documentation

We use swagger for documentation
*/documentation

## Contributing

For now, we'll be going off of a derivative of the gitflow protocol. Create a branch off of master, call it IS-{issue#}-a_descriptive_name, and then when it's ready, create a pull request for code review.
