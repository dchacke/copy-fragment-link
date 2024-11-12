browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTextFragment') {
    let selection = window.getSelection();
    let selectedText = selection.toString();

    selection.modify('move', 'backward', 'character');

    for (i = 0; i < 4; i++) {
      selection.modify('extend', 'left', 'word');
    }

    // At this point, all text to the left of the original selection
    // is selected.
    let prefix = selection.toString().trim();

    // Once to jump toward the beginning of the selected text,
    // and then length times to jump to the end of it.
    let iterations = selectedText.length + 1;

    for (let i = 0; i < iterations; i++) {
      selection.modify('move', 'forward', 'character');
    }

    for (i = 0; i < 4; i++) {
      selection.modify('extend', 'right', 'word');
    }

    // At this point, the entire paragraph is selected.
    let suffix = selection.toString().trim();

    sendResponse([prefix, selectedText, suffix]);

    // Clear selection
    selection.empty();
  } else if (message.action === 'navigateToFragment') {
    location.hash = message.fragment;
  }

  return true; // Ensures the response is asynchronous
});
