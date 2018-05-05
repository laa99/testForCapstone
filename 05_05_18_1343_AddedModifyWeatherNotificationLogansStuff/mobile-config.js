App.accessRule('*.google.com/*');
App.accessRule('*.googleapis.com/*');
App.accessRule('*.gstatic.com/*');
App.accessRule('http://*', {type: 'intent'});
App.accessRule('https://*', {type: 'intent'});
App.accessRule("blob:*");
App.accessRule('*');

App.icons({
  'android_mdpi': 'waterdrop.png',
  'android_hdpi': 'waterdrop.png',
  'android_xhdpi': 'waterdrop.png',
  'android_xxhdpi': 'waterdrop.png',
  'android_xxxhdpi': 'waterdrop.png'
});

App.launchScreens({
  'android_mdpi_portrait': 'hydrosplash.png',
  'android_mdpi_landscape': 'hydrosplash.png',
  'android_hdpi_portrait': 'hydrosplash.png',
  'android_hdpi_landscape': 'hydrosplash.png',
  'android_xhdpi_portrait': 'hydrosplash.png',
  'android_xhdpi_landscape': 'hydrosplash.png',
  'android_xxhdpi_portrait': 'hydrosplash.png',
  'android_xxhdpi_landscape': 'hydrosplash.png',
  'android_xxxhdpi_portrait': 'hydrosplash.png',
  'android_xxxhdpi_landscape': 'hydrosplash.png'
});
