casper.start('http://localhost:8000/bb-prototype-website_stylesheet.html')
.then(function() {
  phantomcss.screenshot('#header', 'site-header');
});
