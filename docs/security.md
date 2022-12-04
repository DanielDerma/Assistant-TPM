### 🔐 Security

In summary, the Router function is a React component that is responsible for managing the routes in our application using useAuth and useRoutes to control access to routes based on the current user's authentication state.

Firebase provides us with a set of tools and services that allow us to easily implement authentication and authorization in our application. With Firebase, we can create users and manage their permissions easily, which allows us to restrict access to certain routes in our application to certain users.

React Router DOM allows us to define and manage the different routes in our application. With React Router DOM, we can specify which component should be shown for each route, which allows us to create a multi-page application. We can also use React Router DOM to redirect users to specific pages based on their permissions. For example, if a user does not have permission to access a particular route, we can redirect them to a login page or an error message.

React Context allows us to easily share data and functionality between different components in our application. With React Context, we can create a "provider" that stores data such as the currently authenticated user and their permissions, and share it with all components that need it. This way, we can control access to certain routes in our application in a centralized and consistent manner throughout the entire application.

In summary, protecting our application's routes using Firebase, React Router DOM, and React Context allows us to easily and efficiently implement authentication and authorization, which allows us to easily and efficiently restrict access to certain routes to certain users.

## [💻 Code](../src/routes.js)

The Router function is a React component that is responsible for managing the routes in our application. The function uses the useAuth hook to get information about the current user's authentication, such as whether they are authenticated or not, and whether they are an administrator or not. The function also uses the useRoutes function to define the different routes in our application and the components that should be displayed for each route.

The useRoutes function takes an array of objects that represent the routes in our application. Each object includes the path property, which indicates the route that will be accessed, and the element property, which indicates the component that should be displayed for that route. In addition, each object can include a children property, which contains an array of objects that represent child routes of the parent route.

In the provided code, several different routes are defined. The /dashboard route displays the DashboardLayout component if the user is authenticated, or redirects the user to the /login route if they are not authenticated. The /dashboard route also includes several child routes, such as add, filter, export, app, and admin, which display different components depending on whether the user is an administrator or not. The login route displays the Login component if the user is not authenticated, or redirects the user to the /dashboard/add route if they are authenticated.

```js
    {
      path: '/dashboard',
      element: isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />,
      children: [
        {
          element: <Navigate to="/dashboard/add" replace />,
          index: true,
        },
        { path: 'add', element: <Add isAdmin={isAdmin} /> },
        { path: 'filter', element: <Filter isAdmin={isAdmin} /> },
        { path: 'export', element: <Export isAdmin={isAdmin} /> },
        { path: 'app', element: <App isAdmin={isAdmin} /> },
        { path: 'admin', element: isAdmin ? <Admin /> : <Navigate to="/404" /> },
        {
          path: 'manage',
          element: isAdmin ? <ManageLayout /> : <Navigate to="/404" />,
          children: [
            { element: <Companies />, index: true },
            { path: '*', element: <SubItems /> },
          ],
        },
      ],
    },
```

This code defines three routes: /login, /, and \*. The /login route checks whether the user is authenticated. If the user is not authenticated, it renders the <Login /> component. If the user is authenticated, it redirects them to the /dashboard/add route using the <Navigate /> component.

The / route renders the <LogoOnlyLayout /> component and also defines three child routes: /, 404, and _. The / child route redirects the user to the /dashboard/add route using the <Navigate /> component. The 404 child route renders the <NotFound /> component. The _ child route redirects the user to the /404 route using the <Navigate /> component.

The \* route is a catch-all route that is matched when none of the other routes are matched. This route redirects the user to the /404 route using the <Navigate /> component with the replace option, which replaces the current route in the history stack instead of adding a new entry. This prevents the user from going back to the previous route using the browser's back button.

```js
    {
      path: 'login',
      element: !isAuthenticated ? <Login /> : <Navigate to="/dashboard/add" />,
    },
    {
      path: '/',
      element: <LogoOnlyLayout />,
      children: [
        { path: '/', element: <Navigate to="/dashboard/add" /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
```
