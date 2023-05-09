function decorateBlock(block, rules, type = 'css') {
  const blockName = block.getAttribute('data-block-name');

  if (type === 'css') {
    const blockCssClassNames = block.getAttribute('class');

    const variants = blockCssClassNames.split(' ').filter((cssClassName) => {
      if (cssClassName !== 'block' && cssClassName !== blockName) {
        return cssClassName;
      }
      return null;
    });

    variants.forEach((variant) => {
      if (variant) {
        block.classList.add(`${blockName}--${variant}`);
      }
    });
  }

  if (rules) {
    Object.keys(rules).forEach((key) => {
      const selector = rules[key];
      if (selector) {
        const elements = block.querySelectorAll(rules[key]);
        elements.forEach((element) => {
          const ids = key.split(' ') || [];

          if (type === 'css') {
            ids.forEach((cssClass) => element.classList.add(cssClass));
          } else if (type === 'js') {
            ids.forEach((id) => {
              console.log(element);
              element.setAttribute(`data-js-${id}`, '');
            });
          }
        });
      }
    });
  }
}

export function decorateBlockCss(block, rules) {
  decorateBlock(block, rules, 'css');
}

export function decorateBlockJs(block, rules) {
  decorateBlock(block, rules, 'js');
}
