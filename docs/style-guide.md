### 👁️ Style Guide

Theming in React with Material-UI allows for customizing the look and feel of an application. This is accomplished through the use of a theme provider, which provides the styles and options for the theme.

In the provided code, the theme provider is implemented using the Material-UI ThemeProvider component. The theme options are created using the useMemo hook, which defines the palette, shape, typography, shadows, and custom shadows for the theme. The theme is then created using the createTheme function, and the custom components are added to the theme using the componentsOverride function.

The theme provider also includes the StyledEngineProvider and CssBaseline components, which ensure that the styles are applied consistently throughout the application.

The theme itself is created and customized using the files in the theme folder. The [index.js](../src/theme/index.js) file exports the theme provider, **and the other files define the various options for the theme, such as the palette, shadows, and typography.** The overrides folder contains custom styles for specific Material-UI components, such as Button and Input.

Overall, the theme provider and related files provide a flexible and customizable solution for implementing themes in a React application using Material-UI.
