import { decorateBlockCss, decorateBlockJs } from '../../utils/decorateBlockCss.js';
import { createElementFromHTML } from '../../utils/htmlHelpers.js';

const cssDecorationRules = {
  features__title: ':scope div:nth-child(1) h3',
  'features__filters-list': ':scope div:nth-child(1) ul',
  'features__filters-list-item': ':scope div:nth-child(1) ul li',
  'features__filters-list-item-link': ':scope .features__filters-list-item a',
  'features__list-wrapper': '.features > div:nth-child(2)',
};

const jsDecorationRules = {
  'features--filters-list-item-link': ':scope div:nth-child(1) a',
  'features--list-item-link': ':scope div:nth-child(2) a',
};

async function createFeaturesList(block) {
  const response = await fetch('/query-index.json');
  const json = await response.json();

  block.querySelector('.features__list-wrapper').appendChild(createElementFromHTML('<ul class="features__list"></ul>'));

  json.data.forEach((item) => {
    const tags = JSON.parse(item.tags).map((tag) => tag.toLowerCase().replace(/(\s|_|\.)/g, '-'));

    block.querySelector('.features__list').appendChild(createElementFromHTML(`
        <li class="features__list-item">
          <a class="features__list-item-link" data-tags="${tags.join(' ')}" href="${item.path}">${item.title}</a>
        </li>`));
  });
}

function addEventHandler(block) {
  block.querySelectorAll('.features__filters-list-item-link').forEach((filterItem) => {
    filterItem.addEventListener('click', (event) => {
      event.preventDefault();

      // Mark filters as selected or not selected

      filterItem.dataset.selected = !(filterItem.dataset.selected === 'true');

      if (filterItem.dataset.selected === 'true') {
        filterItem.classList.add('features__filters-list-item-link--selected');
      } else {
        filterItem.classList.remove('features__filters-list-item-link--selected');
      }

      const selectedTags = [...block.querySelectorAll('.features__filters-list-item-link')]
        .filter((item) => item.dataset.selected === 'true')
        .map((item) => item.href.split('#')[1]);

      block.querySelectorAll('.features__list-item').forEach((item) => {
        const featureTags = item.querySelector('.features__list-item-link').getAttribute('data-tags').split(' ');

        const found = selectedTags.length === 0
            // eslint-disable-next-line max-len
            || featureTags.filter((featureTag) => selectedTags.indexOf(featureTag) >= 0).length === selectedTags.length;

        if (found) {
          item.classList.remove('features__list-item--hidden');
        } else {
          item.classList.add('features__list-item--hidden');
        }
      });
    });
  });
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The block element
 */
export default async function decorate(block) {
  decorateBlockCss(block, cssDecorationRules);
  decorateBlockJs(block, jsDecorationRules);

  await createFeaturesList(block);

  decorateBlockCss(block, cssDecorationRules);
  decorateBlockJs(block, jsDecorationRules);

  addEventHandler(block);
}
