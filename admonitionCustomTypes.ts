// The default keywords are important, tip, note, warning
// and danger.
// Aliases for info => important, success => tip,
// secondary => note and danger => warning have been
// added for Infima compatibility.

// Default keyword types can coexist with custom types.
// Custom type keywords take precedence over and override
// the default keywords.

// Set infima: true in the plugin options to Enable ifmClass

export const admonitionCustomTypes = {

  question: {
    keyword: 'question',
    emoji: '❓',
    ifmClass: 'alert--info admonition admonition-question',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.52-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.47 1.244-1.06 1.244-2.01 0-1.42-1.276-2.176-2.673-2.176-1.4 0-2.655.81-2.75 2.35zm1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94z"/></svg>'
  },

  example: {
    keyword: 'example',
    emoji: '💡',
    ifmClass: 'alert--primary admonition admonition-example',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M2 6a6 6 0 1 1 12 0c0 2.5-1.5 4-3 5v1a1 1 0 0 1-2 0v-1c-1.5-1-3-2.5-3-5z"/></svg>'
  },

  faq: {
    keyword: 'faq',
    emoji: '💬',
    ifmClass: 'alert--secondary admonition admonition-faq',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 1a7 7 0 1 0 6.93 6H8V1z"/></svg>'
  },

  caution: {
    keyword: 'caution',
    emoji: '⚠️',
    ifmClass: 'alert--warning admonition admonition-caution',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M7.938 2.016a.13.13 0 0 1 .125 0l6.857 11.856c.03.052.03.115 0 .167a.13.13 0 0 1-.125.067H1.28a.13.13 0 0 1-.125-.067.13.13 0 0 1 0-.167L7.938 2.016zM8 5c-.535 0-.954.462-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 5zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/></svg>'
  },

}

export default admonitionCustomTypes
