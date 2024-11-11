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

browser.contextMenus.create({
  id: 'navigateToFragment',
  title: 'Navigate to fragment',
  contexts: ['selection']
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId != 'copyFragmentUrl' && info.menuItemId != 'copyFragmentPath' && info.menuItemId != 'navigateToFragment') {
    return;
  }

  let [prefix, selectedText, suffix] = await browser.tabs.sendMessage(tab.id, { action: 'getTextFragment' });

  prefix = processAffix(prefix, 'prefix');
  suffix = processAffix(suffix, 'suffix');

  const result = pointer(info, tab, prefix, selectedText, suffix)

  if (info.menuItemId === 'copyFragmentUrl' || info.menuItemId === 'copyFragmentPath') {
    copyToClipboard(result);
  } else if (info.menuItemId === 'navigateToFragment') {
    browser.tabs.sendMessage(tab.id, { action: 'navigateToFragment', fragment: result });
  }
});

function pointer(info, tab, prefix, selectedText, suffix) {
  if (prefix) {
    prefix = encodeURIComponent(prefix) + '-,';
  }

  selectedText = encodeURIComponent(selectedText);

  if (suffix) {
    suffix = ',-' + encodeURIComponent(suffix);
  }

  let fragment = `#:~:text=${prefix}${selectedText}${suffix}`;

  if (info.menuItemId === 'copyFragmentUrl') {
    return tab.url.split('#')[0] + fragment;
  } else if (info.menuItemId === 'copyFragmentPath') {
    const path = (new URL(tab.url)).pathname;

    return path + fragment;
  } else if (info.menuItemId === 'navigateToFragment') {
    return fragment;
  }
}

function processAffix(affix, type) {
  affix = affix.trim();

  let result;

  if (type === 'prefix') {
    // Keep only the last four words
    result = affix.match(/(\S+\s*){4}$/);
  } else if (type === 'suffix') {

    // Keep only the first four words
    result = affix.match(/^(\S+\s*){4}/);
  }

  return result ? result[0].trim() : '';
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
