import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./frontend/index.html', './frontend/src/**/*.{js,ts,vue}'],
    theme: {
        extend: {
            colors: {
                font: {
                    light: '#000000',
                    dark: '#ffffff',
                    error: {
                        light: colors.red[500],
                        dark: colors.red[300],
                    },
                    success: {
                        light: colors.green[500],
                        dark: colors.green[300],
                    }
                  },
                backgorund: {
                    light: 'hsl(0, 0%, 97%)',
                    dark: 'hsl(180, 80%, 3%)'
                },
                container: {
                    light: 'hsl(0, 0%, 98%)',
                    dark: 'hsl(200, 20%, 13%)',
                    border: {
                      light: 'hsl(0, 0%, 80%)',
                      dark: 'hsl(0, 0%, 25%)'
                    }
                  },
                interactable: {
                    light: 'hsl(0, 0%, 100%)',
                    dark: 'hsl(180, 30%, 18%)',
                    border: {
                      light: 'hsl(0, 0%, 75%)',
                      dark: 'hsl(0, 0%, 30%)'
                    },
                    selected: {
                        light: 'hsl(0, 0%, 95%)',
                        dark: 'hsl(180, 30%, 25%)'
                    }
                  },
                scrollbar: {
                    backgorund: {
                      light: colors.slate[100],
                      dark: '#30363D'
                    },
                    thumb: {
                      light: colors.slate[400],
                      dark: '#505A66'
                    }
                },
                navbar: {
                    light: '#006634',
                    dark: '#003317',
                },
                tabselector: {
                  light: 'hsl(0, 0%, 60%)',
                  dark: 'hsl(0, 0%, 70%)'
                }
            },
            borderWidth: {
                1: '1px',
            },
        },
    },
    plugins: [],
};
