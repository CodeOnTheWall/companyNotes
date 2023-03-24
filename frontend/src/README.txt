My project name is called Walter Whites Repairs
backend start npm run dev, frontend npm start

In this MERN stack project, I am implementing many back end features for practice with node js as well as RTK Query.
This list of features can be seen below:

Replace current sticky note system
Add a public facing page with basic contact info
Add an employee login to the notes app
Provide a welcome page after login
Provide easy navigation
Display current user and assigned role
Provide a logout option
Require users to login at least once per week
Provide a way to remove employee access asap if needed
Notes are assigned to specific employees
Notes have a ticket #, title, note body, created & updated dates
Notes are either OPEN or COMPLETED
Users can be Employees, Managers, or Admins
Notes can only be deleted by Managers or Admins
Anyone can create a note (when customer checks-in)
Employees can only view and edit their assigned notes
Managers and Admins can view, edit, and delete all notes
Only Managers and Admins can access User Settings
Only Managers and Admins can create new users
Desktop mode is most important but should be available in mobile

To implement the above features, I've used jwt's with access tokens and refresh tokens for authentication and authorization.
Note on the authentication; I persist login in this app via a PersistLogin wrapper, which gives the state a new access token
on second mount, because of react 18 changes, I dont want the refresh token to be sent on first mount and second, only second mount.
And since this authentication is persisted as long as cookie hasnt expired, the user will be authorized for the wrapped routes (if they also
have the required roles)
There is also a requireAuth wrapper that will specify which routes require which roles

The back end rest api will communicate to the front end via Redux Toolkit Query. To help communicate with backend db, I use mongoose.
The data is prefetched via a prefetch wrapper on protected routes once using a query, and subsequent data refreshes are made via additional queries 
using query options such as: pollingInterval, refetchOnFocus, and refetchOnMountOrArgChange. These options are available upon setting up listeners 
in the store.js

Here are my current dependencies on frontend:

"dependencies": {
    "@fortawesome/fontawesome-svg-core": "^6.2.1",
    "@fortawesome/free-solid-svg-icons": "^6.2.1",
    "@fortawesome/react-fontawesome": "^0.2.0",
    "@reduxjs/toolkit": "^1.9.1",
    "@testing-library/jest-dom": "^5.16.5",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^14.4.3",
    "jwt-decode": "^3.1.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^8.0.5",
    "react-router-dom": "^6.5.0",
    "react-scripts": "5.0.1",
    "react-spinners": "^0.13.7",
    "web-vitals": "^2.1.4"
  },

  And current dependencies on backend:
  "dependencies": {
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "date-fns": "^2.29.3",
    "dotenv": "^16.0.3",
    "express": "^4.18.2",
    "express-async-errors": "^3.1.1",
    "express-rate-limit": "^6.7.0",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^6.8.1",
    "mongoose-sequence": "^5.3.1",
    "react-spinners": "^0.13.7",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }

Please feel free to message me at bralencsundquist@hotmail.com for any recommendations I could add to my first full MERN stack project





