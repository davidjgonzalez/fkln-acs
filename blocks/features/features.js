import { Extractors, htmlToJson } from '../../utils/htmlToJson.js';

function addFilterClickEventHandler(block) {
  block.querySelectorAll('[data-fn-filter]').forEach((filter) => {
    filter.addEventListener('click', (event) => {
      event.preventDefault();

      filter.ariaPressed = !(filter.ariaPressed === 'true');

      const filterTags = [...block.querySelectorAll('[data-fn-filter]')].filter((item) => item.ariaPressed === 'true').map((item) => item.dataset.fnTag);

      let hasFeatures = false;
      block.querySelectorAll('[data-fn-feature]').forEach((item) => {
        const featureTags = item.dataset.fnTags.split(',');

        const found = filterTags.length === 0
            // eslint-disable-next-line max-len
            || featureTags.filter((tag) => filterTags.indexOf(tag) >= 0).length === filterTags.length;

        if (found) {
          item.classList.remove('hidden');
          hasFeatures = true;
        } else {
          item.classList.add('hidden');
        }
      });

      if (hasFeatures) {
        block.querySelector('[data-fn-no-features]').classList.add('hidden');
      } else {
        block.querySelector('[data-fn-no-features]').classList.remove('hidden');
      }
    });
  });
}

const rules = {
  title: { selector: 'h3', extractor: Extractors.text },
  filters: { selector: 'ul li a', extractor: Extractors.link, cardinality: 'many' },
  noFeatures: { selector: 'p', extractor: Extractors.text },
};

async function getFeatures() {
  const response = await fetch('/query-index.json');
  const json = await response.json();

  return json.data.map((item) => ({
    title: item.title,
    description: item.description,
    path: item.path,
    tags: JSON.parse(item.tags).map((tag) => tag.toLowerCase().replace(/(\s|_|\.)/g, ' ')),
  })) || [];
}

const html = ({title, filters, features, noFeatures}) => `
  <div class="container">
    <h3 class="title">${title.text}</h3>
    
    <ul class="filters">
      ${filters.map((filter) => `<li class="filter button" role="button" aria-pressed="false" aria-label="${filter.text}" data-fn-filter data-fn-tag="${filter.text.toLowerCase()}">
          ${filter.text}
        </li>`).join('')}
    </ul>

    <ul class="features">
      ${features.map((feature) => `<li class="feature" data-fn-feature data-fn-tags="${feature.tags.join(',')}">
          <a class="link" href="${feature.path}">
            <h3 class="title">${feature.title}</h3>
            <p class="description">${feature.description}</p>          
          </a>
        </li>`).join('')}
    </ul>

    <p class="no-features hidden" data-fn-no-features>${noFeatures.text}</p>
  </div> 
  `;

/**
 * decorates the header, mainly the nav
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  const content = htmlToJson(block, rules);
  content.features = await getFeatures();

  block.innerHTML = html({ 
   title: content.title, 
   filters: content.filters, 
   features: content.features,
   noFeatures: content.noFeatures
  });

  addFilterClickEventHandler(block);
}
