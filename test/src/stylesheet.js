casper.start('http://localhost:8000/bb-prototype-website_stylesheet.html')
.then(function() {
  phantomcss.screenshot('#header', 'site-header');

  phantomcss.screenshot('#stylesheet_headers', 'stylesheet-headers');
  phantomcss.screenshot('#stylesheet_paragraphs', 'stylesheet-paragraphs');
  phantomcss.screenshot('#stylesheet_lists', 'stylesheet-lists');
  phantomcss.screenshot('#stylesheet_form_horizontal', 'stylesheet-form-horizontal');
  phantomcss.screenshot('#stylesheet_buttons', 'stylesheet-buttons');
});
