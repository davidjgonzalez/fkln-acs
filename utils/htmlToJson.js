export function onlyText(element) {
  let child = element.firstChild;
  const texts = [];

  while (child) {
    if (child.nodeType === 3) {
      texts.push(child.data);
    }
    child = child.nextSibling;
  }

  return texts.join('');
}

export function htmlToJson(block, rules = {}) {
  const json = {};

  Object.keys(rules).forEach((key) => {
    const selector = rules[key].selector?.trim() || '';
    const index = rules[key].index || 0;
    const scope = rules[key].scope || '';
    const options = rules[key].options || {};
    const elements = !selector ? [block] : Array.from(block.querySelectorAll(`${scope} ${selector}`));
    const content = elements?.map((element) => rules[key].extractor(element, options) || []);

    if (rules[key].cardinality === 'many') {
      json[key] = content;
    } else if (content.length > index) {
      json[key] = content[index];
    } else {
      // eslint-disable-next-line prefer-destructuring
      json[key] = content[0];
    }
  });

  return json;
}

/* eslint-disable max-len */
// eslint-disable-next-line import/prefer-default-export
export const Extractors = {
  text: (element) => ({
    type: 'text',
    text: element.innerText.trim(),
    html: element.outerHTML.trim(),
    element,
  }),

  onlyText: (element) => ({
    type: 'text',
    text: onlyText(element).trim(),
    html: element.outerHTML.trim(),
    element,
  }),

  link: (element) => ({
    type: 'link',
    url: element.getAttribute('href'),
    text: element.textContent.trim(),
    html: element.outerHTML.trim(),
    element,
  }),

  list: (element) => ({
    type: 'list',
    items: Array.from(element.querySelectorAll('li')).map((item) => item),
    html: element.outerHTML.trim(),
    element,
  }),

  picture: (element) => ({
    type: 'picture',
    src: element.querySelector('img').src,
    alt: element.querySelector('img').alt.trim() || '',
    html: element.outerHTML.trim(),
    element,
  }),

  children: (element, options) => (htmlToJson(element, options.rules)),
};
