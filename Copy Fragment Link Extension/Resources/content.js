browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === 'getTextFragment') {
    let selection = window.getSelection();
    let selectedText = selection.toString();

    // Construct prefix based on preceding text in paragraph
    selection.modify('extend', 'left', 'paragraphboundary');

    // At this point, all text to the left of the original selection
    // is selected.
    let leftText = window.getSelection().toString();
    let prefix = leftText.substr(0, leftText.length - selectedText.length);

    // Construct suffix based on rest of text in paragraph
    selection.modify('extend', 'right', 'paragraphboundary');

    // At this point, the entire paragraph is selected.
    let wholeParagraph = window.getSelection().toString();
    let suffix = wholeParagraph.substr(leftText.length, wholeParagraph.length);

    sendResponse([prefix, selectedText, suffix]);

    // Clear selection
    window.getSelection().empty();
  }

  return true; // Ensures the response is asynchronous
});
