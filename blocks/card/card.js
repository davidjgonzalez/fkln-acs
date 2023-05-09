import { Extractors, htmlToJson } from '../../utils/htmlToJson.js';

const rules = {
  eyebrow: { selector: 'h3', extractor: Extractors.text },
  title: { selector: 'h4', extractor: Extractors.text },
  description: { selector: 'p', extractor: Extractors.text },
  button: { selector: 'a', extractor: Extractors.link },
  list: { selector: 'ul', extractor: Extractors.list },
};

const html = ({
  eyebrow, title, description, button, list,
}) => `
    <div class="top">
      <h1 class="eyebrow">${eyebrow.text}</h1>
      <h2 class="title">${title.text}</h2>

      <p class="description">${description.text}</p>

      <a class="button button-primary" href="${button?.url}">${button?.text}</a>
      </div>
      <div class="bottom">       
        <ul class="list">
          ${list.items?.map((item) => `<li class="list-item">${item.innerText}</li>`).join('')}
        </ul>
    </div>
  `;

/**
 * decorates the header, mainly the nav
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const content = htmlToJson(block, rules);

  block.innerHTML = html({
    eyebrow: content.eyebrow,
    title: content.title,
    description: content.description,
    button: content.button || {},
    list: content.list || {},
  });
}
