import { Extractors, htmlToJson } from '../../utils/htmlToJson.js';

function addTabClickEventHandler(block) {
  block.querySelectorAll('[data-fn-tab]').forEach((tab) => {
    tab.addEventListener('click', (event) => {
      event.preventDefault();

      // Only show active tab
      block.querySelectorAll('[data-fn-tab]').forEach((item) => {
        item.ariaSelected = false;
        item.classList.remove('active');
      });
      tab.ariaSelected = true;
      tab.classList.add('active');

      // Only show active tab panel
      block.querySelectorAll('[data-fn-tab-panel]').forEach((item) => { item.classList.add('hidden'); });
      block.querySelectorAll(`[data-fn-tab-panel="${tab.dataset.fnTab}"]`).forEach((item) => { item.classList.remove('hidden'); });
    });
  });
}

const rules = {
  title: { selector: 'h1,h2', extractor: Extractors.text },
  tabs: {
    selector: ':scope > div:not(:first-child)',
    cardinality: 'many',
    extractor: Extractors.children,
    options: {
      rules: {
        title: { selector: 'h3', extractor: Extractors.text },
        info: { selector: 'p,ul', extractor: Extractors.text, cardinality: 'many' },
        codeLabel: { selector: 'h4', extractor: Extractors.text },
        code: { selector: 'pre', extractor: Extractors.text },
      },
    },
  },
};

const html = ({ title, tabs }) => `
  <h2 class="title">${title.text}</h2>

  <div class="container">

    <div class="info-container">
      <!-- Tabs -->
      <ul class="tabs" role="tab-list">
        ${tabs.map((tab, index) => `
        <li role="tab" class="tab ${index === 0 ? 'active' : ''}" aria-selected="${index === 0}" data-fn-tab="${tab.title.text}">
          ${tab.title.text}
        </li>`).join('')}
      </ul>

      <!-- Info tab panels -->
      <div class="tab-info-panels">
        ${tabs.map((tab, index) => `<div class="tab-panel info-panel ${index > 0 ? 'hidden' : ''}" role="tabpanel" data-fn-tab-panel="${tab.title.text}">
          ${tab.info.map((info) => `${info.html}`).join('')}
        </div>`).join('')}
      </div>
    </div>

    <div class="code-container">
      <!-- Code tab panels -->
      ${tabs.map((tab, index) => `<div class="tab-panel code-panel ${index > 0 ? 'hidden' : ''}" role="tabpanel" data-fn-tab-panel="${tab.title.text}">
        <h4 class="code-label">${tab.codeLabel.text}</h4>
        <pre class="code-block">${tab.code.html}</pre>
        </div>`).join('')}
    </div>

  </div>

  `;

export default function decorate(block) {
  // Process each tab with the rules
  const content = htmlToJson(block, rules);
  console.log(content);

  block.innerHTML = html({
    title: content.title,
    tabs: content.tabs,
  });

  addTabClickEventHandler(block);
}
