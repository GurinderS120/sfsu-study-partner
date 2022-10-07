## Basic flow of our website

### pages directory/folder:

Represents the different `pages` for our website, so if
a user goes to `our website's url/` then the `index.js` will be served since
the user requested the home page (represented by the "/").

Similarly if a user types in `our website's url/login` then the `login.js` page is
served.

#### Note: The `page` is first converted to valid html under the hood by Reactjs

before it gets served to the user

### \_app.js:

Is the starting point of our website as it initializes each page
(take a look into `pages/_app.js`)

#### Note: Since each `page` represents a unique `url` endpoint, so we only want to

put files that we want to display or serve to the user as separate pages. If you
want to create a `reusable` component that could be used in multiple pages create
that in components folder (like navbar).

### Styling:

We will be using `react-bootstrap` along with basic `bootstrap`. If you want to
override some bootstrap styles then you can create a css file for that `page` or
component like we did for Navbar. It's a good idea to put the styles for a
component in component folder and the styles for a `page` in the styles folder
