browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTextFragment') {
    let selection = window.getSelection();
    let selectedText = selection.toString();

    selection.modify('move', 'backward', 'character');

    // Jump up high enough we select some text somewhere
    selection.modify('extend', 'left', 'paragraph');

    // Make sure no cut-off word at the beginning (that would break the prefix)
    selection.modify('extend', 'left', 'paragraphboundary');

    // At this point, all text to the left of the original selection
    // is selected.
    let prefix = selection.toString();

    // Once to jump toward the beginning of the selected text,
    // and then length times to jump to the end of it.
    let iterations = selectedText.length + 1;

    for (let i = 0; i < iterations; i++) {
      selection.modify('move', 'forward', 'character');
    }

    // Jump down low enough we select some text somewhere
    selection.modify('extend', 'right', 'paragraph');

    // Make sure no cut-off word at the end (that would break the suffix)
    selection.modify('extend', 'right', 'paragraphboundary');

    // At this point, the entire paragraph is selected.
    let suffix = selection.toString();

    sendResponse([prefix, selectedText, suffix]);

    // Clear selection
    selection.empty();
  } else if (message.action === 'navigateToFragment') {
    location.hash = message.fragment;
  }

  return true; // Ensures the response is asynchronous
});
