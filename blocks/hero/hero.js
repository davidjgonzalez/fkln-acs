import { Extractors, htmlToJson } from '../../utils/htmlToJson.js';

const rules = {
  title: { selector: 'h4', extractor: Extractors.text },
  description: { selector: 'p:not([class])', extractor: Extractors.text },
  primaryButton: { selector: 'a', extractor: Extractors.link, index: 0 },
  secondaryButton: { selector: 'a', extractor: Extractors.link, index: 1 },
  picture: { selector: 'picture', extractor: Extractors.picture },
};

const html = (title, description, primaryButton, secondaryButton, picture) => `
  <div class="container">

    <div class="left">
      <h1 class="title">${title.text}</h1>
      <p class="description">${description.text}</p>
      
      <a class="button button-primary" href="${primaryButton.path}">${primaryButton.text}</a>
      <a class="button button-secondary" href="${secondaryButton.path}">${secondaryButton.text}</a>
    </div>
    <div class="right">     
      <picture class="image">${picture.html}</picture>
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
    content.primaryButton,
    content.secondaryButton,
    content.picture,
  );
}
