export function createElementFromHTML(htmlString) {
  const body = document.createElement('body');
  body.innerHTML = htmlString.trim();

  return body.firstChild;
}

export function createElementsFromHTML(htmlString) {
  const body = document.createElement('body');
  body.innerHTML = htmlString.trim();

  return body.childNodes;
}
