browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTextFragment') {
    let selection = window.getSelection();
    let selectedText = selection.toString();
    let range = selection.getRangeAt(0).cloneRange();

    selection.modify('move', 'backward', 'character');

    let prefix = '';

    for (i = 0; i < 4; i++) {
      selection.modify('extend', 'left', 'word');

      if (anyIllegalElements(selection)) {
        break;
      } else {
        prefix = selection.toString().trim();
      }
    }

    // Move to the end of the original selection again
    selection.removeAllRanges();
    selection.addRange(range);
    selection.modify('move', 'forward', 'character');

    let suffix = '';

    for (i = 0; i < 4; i++) {
      selection.modify('extend', 'right', 'word');

      if (anyIllegalElements(selection)) {
        break;
      } else {
        suffix = selection.toString().trim();
      }
    }

    sendResponse([prefix, selectedText, suffix]);

    // Clear selection
    selection.empty();
  } else if (message.action === 'navigateToFragment') {
    location.hash = message.fragment;
  }

  return true; // Ensures the response is asynchronous
});

function selectedElements(selection) {
  // Get the range from the selection
  const range = selection.getRangeAt(0);

  // Create a TreeWalker to traverse the DOM within the selected range
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,  // Root node for traversal
    NodeFilter.SHOW_ELEMENT,        // Only show element nodes
    {
      acceptNode: node => {
        // If the node is within the selection's range, accept it
        if (range.isPointInRange(node, 0)) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    },
    false
  );

  // Collect all the element nodes under the selection
  const elements = [];
  let node;
  while ((node = walker.nextNode())) {
    elements.push(node);
  }

  return elements;
}

function anyIllegalElements(selection) {
  return selectedElements(selection).some(el => {
    return window.getComputedStyle(el).getPropertyValue('-webkit-user-select') === 'none' ||
      window.getComputedStyle(el).getPropertyValue('user-select') === 'none' ||
      el.tagName === 'IFRAME' ||
      el.tagName === 'IMG';
  });
}
