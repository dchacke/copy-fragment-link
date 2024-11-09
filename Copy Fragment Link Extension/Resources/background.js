// Create a context menu item when the extension is installed
browser.contextMenus.create({
  id: 'customCopyFragmentLink',
  title: 'Copy fragment link',
  contexts: ['selection'], // Only show when there's selected text
});

// Handle the click event for the context menu
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'customCopyFragmentLink') {
    const selectedText = info.selectionText;

    if (selectedText) {
      // Encode the selected text to be safely used in a URL fragment
      const encodedText = encodeURIComponent(selectedText);

      // Construct the fragment link (using the current page's URL)
      const fragmentLink = `${tab.url}#:~:text=${encodedText}`;

      // Copy the link to the clipboard
      copyToClipboard(fragmentLink);
    } else {
      console.log('No text selected');
    }
  }
});

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Fragment link copied to clipboard:', text);
    })
    .catch((err) => {
      console.error('Failed to copy text to clipboard:', err);
    });
}
