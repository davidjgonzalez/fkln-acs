import { buildBlock } from '../../scripts/lib-franklin.js';
import decorateColumn from '../columns/columns.js';

export function buildAutoBlock(main) {
  main.querySelectorAll('.columnblocks').forEach((columnBlock) => {
    columnBlock.classList.add('columns');
    decorateColumn(columnBlock);

    const root = columnBlock.children[1];
    const blockNames = Array.from(columnBlock.children[0].querySelectorAll(':scope > div')).map((cell) => cell.innerText.trim());
    const fauxBlocks = Array.from(columnBlock.children[1].querySelectorAll(':scope > div'));

    fauxBlocks.forEach((fauxBlock, index) => {
      let fauxBlockNames = blockNames[index]?.toLowerCase().trim();
      fauxBlockNames = fauxBlockNames.match(/([^\\(]+)\s*(\(([^\\)]+)\))*/);

      const blockName = (fauxBlockNames ? fauxBlockNames[1] : blockNames[index]).trim() || 'generic';
      const variants = fauxBlockNames ? fauxBlockNames[3]?.split(' ') : [];

      const newBlock = buildBlock(blockName, { elems: [...fauxBlock.children] });
      newBlock.dataset.isBlock = 'true';
      variants?.forEach((variant) => newBlock.classList.add(variant.trim()));
      fauxBlock.remove();
      const outerWrapper = document.createElement('div');
      const innerWrapper = document.createElement('div');
      outerWrapper.appendChild(innerWrapper);
      innerWrapper.appendChild(newBlock);
      root.appendChild(outerWrapper);
    });

    // Remove the block name rows
    columnBlock.children[0].remove();
  });
}

export default async function decorate(block) {
  // Do nothing
}
