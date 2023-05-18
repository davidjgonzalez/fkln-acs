/* eslint-disable no-unused-expressions */
/* global describe before it */

import { readFile } from '@web/test-runner-commands';
import { expect } from '@esm-bundle/chai';
import sinon from 'sinon';
import { blockUtils } from '../../utils/auto-blocker.js';

let blockUtils;

document.body.innerHTML = await readFile({ path: './auto-block.html' });
document.head.innerHTML = await readFile({ path: './head.html' });

describe('Auto blocking', () => {
    it('Finds', async () => {
      blockUtils.decorateSections(document.querySelector('main'));
      expect(document.querySelectorAll('main .section').length).to.equal(2);
    });
  
    it('Decorates blocks', async () => {
      blockUtils.decorateBlocks(document.querySelector('main'));
      expect(document.querySelectorAll('main .block').length).to.equal(1);
    });
  
    it('Loads blocks', async () => {
      await blockUtils.loadBlocks(document.querySelector('main'));
      document.querySelectorAll('main .block').forEach(($block) => {
        expect($block.dataset.blockStatus).to.equal('loaded');
      });
    });
  
    it('Updates section status', async () => {
      blockUtils.updateSectionsStatus(document.querySelector('main'));
      document.querySelectorAll('main .section').forEach(($section) => {
        expect($section.dataset.sectionStatus).to.equal('loaded');
      });
  
      // test section with block still loading
      const $section = document.querySelector('main .section');
      delete $section.dataset.sectionStatus;
      $section.querySelector(':scope .block').dataset.blockStatus = 'loading';
      blockUtils.updateSectionsStatus(document.querySelector('main'));
      expect($section.dataset.sectionStatus).to.equal('loading');
    });
  
    it('Reads block config', async () => {
      document.querySelector('main .section > div').innerHTML += await readFile({ path: './config.html' });
      const cfg = blockUtils.readBlockConfig(document.querySelector('main .config'));
      expect(cfg).to.deep.include({
        'prop-0': 'Plain text',
        'prop-1': 'Paragraph',
        'prop-2': ['First paragraph', 'Second paragraph'],
        'prop-3': 'https://www.adobe.com/',
        'prop-4': ['https://www.adobe.com/', 'https://www.hlx.live/'],
      });
    });
  });
  