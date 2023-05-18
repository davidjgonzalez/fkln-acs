import { Extractors, htmlToJson } from '../../utils/htmlToJson.js';

const rules = {
  title: { selector: 'h1', extractor: Extractors.text },
  description: { selector: 'p', extractor: Extractors.text },
  link: { selector: 'a', extractor: Extractors.link },
  picture: { selector: 'picture', extractor: Extractors.picture },
};

const html = (title, description, link, picture) => `
  <div class="container">

    <div class="text">
      <h1 class="title">${title.text}</h1>
      <p class="description">${description.text}</p>
      <a href="${link.url}">${link.text}</a>
    </div>      
    <div class="image">
        ${picture.html}
    </div>
  </div> 
  `;

/**
 * decorates the header, mainly the nav
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const content = htmlToJson(block, rules);
  block.innerHTML = html(
    content.title,
    content.description,
    content.link,
    content.picture,
  );
}
