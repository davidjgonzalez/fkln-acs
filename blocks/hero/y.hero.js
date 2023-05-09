/* eslint-disable max-len */
import { decorateBlockCss } from '../../utils/decorateBlockCss.js';
// eslint-disable-next-line import/no-named-default
import { default as decorateColumns } from '../columns/columns.js';

const cssDecorationRules = {
  hero__wrapper: '.hero > div',
  'hero__column--left': '.hero > div > div:nth-child(1)',
  'hero__column--right': '.hero > div > div:nth-child(2)',
  hero__title: '.hero > div > div:nth-child(1) h4',
  hero__description: '.hero > div > div:nth-child(1) > p:nth-child(2)',
  'hero__button-container': '.hero > div:first-child .button-container',
  'hero__button hero__button--primary': '.hero > div > div:nth-child(1) > p:nth-child(3) a',
  'hero__button hero__button--secondary': '.hero > div > div:nth-child(1) > p:nth-child(4) a',
  hero__image: 'picture',
};

/*
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  decorateBlockCss(block, cssDecorationRules);
  decorateColumns(block);
}

/*
<div class="hero home block" data-block-name="hero" data-block-status="loaded">
    <div>
    <div>
        <p>ACS AEM Commons 6.0 is AEM as a Cloud Service compatible! New TouchUI and everything!</p>
        <p class="button-container"><strong><a href="https://github.com/Adobe-Consulting-Services/acs-aem-commons/releases" title="Download" class="button primary">Download</a></strong></p>
        <p class="button-container"><a href="https://github.com/Adobe-Consulting-Services/acs-aem-commons/releases" title="Release notes" class="button primary">Release notes</a></p>
    </div>
    <div>
        <picture>
        <source type="image/webp" srcset="./media_17e9dd0aae03d62b8ebe2159b154d6824ef55732d.png?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 400px)">
        <source type="image/webp" srcset="./media_17e9dd0aae03d62b8ebe2159b154d6824ef55732d.png?width=750&amp;format=webply&amp;optimize=medium">
        <source type="image/png" srcset="./media_17e9dd0aae03d62b8ebe2159b154d6824ef55732d.png?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 400px)">
        <img loading="lazy" alt="" type="image/png" src="./media_17e9dd0aae03d62b8ebe2159b154d6824ef55732d.png?width=750&amp;format=png&amp;optimize=medium" width="1600" height="1066">
        </picture>
    </div>
    </div>
</div>
*/
