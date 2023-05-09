/* eslint-disable max-len */
import { decorateBlockCss } from '../../utils/decorateBlockCss.js';

const cssDecorationRules = {
  'feature-promo__feature': '.feature-promo div',
  'feature-promo__feature-title': '.feature-promo__feature h3',
  'feature-promo__feature-description': '.feature-promo__feature > div > p:nth-child(2)',
  'feature-promo__feature-image-wrapper': '.feature-promo__feature > div > p:last-child',
  'feature-promo__feature-image': '.feature-promo__feature picture',
};

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  decorateBlockCss(block, cssDecorationRules);
  block.querySelectorAll('.feature-promo__feature').forEach((slide, index) => { slide.classList.add(`feature-promo__feature--${index}`); });
}
