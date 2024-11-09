// Create a context menu item when the extension is installed
browser.contextMenus.create({
  id: 'copyFragmentUrl',
  title: 'Copy fragment URL',
  contexts: ['selection'] // Only show when there's selected text
});

browser.contextMenus.create({
  id: 'copyFragmentPath',
  title: 'Copy fragment path',
  contexts: ['selection']
});

// Handle the click event for the context menu
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId != 'copyFragmentUrl' && info.menuItemId != 'copyFragmentPath') {
    return;
  }

  const selectedText = info.selectionText;

  if (!selectedText) {
    return;
  }

  const encodedText = encodeURIComponent(selectedText);

  copyToClipboard(urlOrPath(info, tab, encodedText));
});

function urlOrPath(info, tab, encodedText) {
  let fragment = `#:~:text=${encodedText}`;

  if (info.menuItemId === 'copyFragmentUrl') {
    return tab.url.split('#')[0] + fragment;
  } else if (info.menuItemId === 'copyFragmentPath') {
    const path = (new URL(tab.url)).pathname;

    return path + fragment;
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Fragment link copied to clipboard:', text);
    })
    .catch((err) => {
      console.error('Failed to copy text to clipboard:', err);
    });
}
