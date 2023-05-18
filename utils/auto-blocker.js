export const Elements = {
  title: 'h1, h2, h3, h4',
  paragraph: 'p',
  image: 'p > picture',
  link: 'p > a',
  button: 'p.button-container > a',
  list: 'ul, ol',
  any: '*',
};

/**
 *
 * @param {*} selectors
 * @param {*} parent
 * @returns an array of elements that match the selectors, or null if there is no match
 */
export const getElementsInRange = (
  parent = document.body,
  selectors = [],
  scope = ':scope > ',
) => {
  let startInclusive = true;
  let endInclusive = true;

  if (selectors.length === 0) { return null; }

  // Check for inclusive/exclusive selectors
  if (selectors.length > 1) {
    if (['[', '('].includes(selectors[0])) {
      startInclusive = selectors[0] !== '(';
      selectors.shift();
    }
    if ([']', ')'].includes(selectors[selectors.length - 1])) {
      endInclusive = selectors[selectors.length - 1] !== ')';
      selectors.pop();
    }
  }

  let results = [];
  parent.querySelectorAll(scope).forEach((scopedEl) => {
    let current = scopedEl.querySelector(selectors[0]);

    while (current) {
      const elements = [];
      const elementsToRemove = [];
      let injectAfter = null;

      for (let i = 0; i < selectors.length; i += 1) {
        const selector = selectors[i];

        if (current?.matches(selector)) {
          elements.push(current.cloneNode(true));
          elementsToRemove.push(current);
        } else if (current?.querySelector(selector)) {
          const cloneEl = current.querySelector(selector).cloneNode(true);
          elements.push(cloneEl);
          elementsToRemove.push(current);
        } else {
          console.log('Failed to locate autoblocking elements in', scopedEl);
          break;
        }

        if (i === 0) {
          injectAfter = current.previousElementSibling;
        }

        current = current.nextElementSibling;
      }

      if (!startInclusive) {
        elements.shift();
        elementsToRemove.shift();
      }

      if (!endInclusive) {
        elements.pop();
        elementsToRemove.pop();
      }

      // Remove the elements that were cloned
      elementsToRemove.forEach((el) => el.remove());

      // eslint-disable-next-line no-console
      results.push({
        inject: (block) => {
          if (injectAfter) {
            injectAfter.after(block);
          } else {
            scopedEl.prepend(block);
          }
        },
        elements,
      });

      current = scopedEl.querySelector(selectors[0]);
    }

    // Reverse array to handle correct order of injection
    results = results.reverse();
  });

  return results.filter((result) => result !== null && result?.elements?.length > 0);
};

/**
function getElementSequence(origin, rules) {
  let el = origin;
  const elements = [];

  const match = rules.every((rule) => {
    if (!el) {
      return false;
    }

    if (typeof rule === 'function') {
      // custom function evaluator
      if (rule(el)) {
        elements.push(el);
      } else {
        return false;
      }
    } else if (typeof rule === 'string') {
      // selector
      if (el.matches(rule)) {
        elements.push(el);
      } else {
        return false;
      }
    }

    el = el.nextSibling;
    return true;
  });

  return match ? (elements?.length === rules.length) : false;
}

*/
