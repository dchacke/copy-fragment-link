browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getTextFragment') {
    let selection = window.getSelection();
    let selectedText = selection.toString();

    selection.modify('extend', 'left', 'paragraph');

    // At this point, all text to the left of the original selection
    // is selected.
    let leftText = window.getSelection().toString();

    selection.modify('extend', 'right', 'paragraph');

    // At this point, the entire paragraph is selected.
    let wholeParagraph = window.getSelection().toString();

    sendResponse([leftText, selectedText, wholeParagraph]);

    // Clear selection
    window.getSelection().empty();
  } else if (message.action === 'navigateToFragment') {
    location.hash = message.fragment;
  }

  return true; // Ensures the response is asynchronous
});
