# Markup to Email

Exports a module for converting markup text to email-formatted html.
Also, you can view the live editor [here](https://wyattades.github.com/markup-to-email)

## Formatting Help

### General

By default plain HTML is supported. For example, embedding an image would look like: 
```html
<img src="https://www.example.com/image.png" width="100" height="200" alt="Optional info about the image"/> 
```
Or making bold text in a paragraph:
```html
This is some <b>Bold Text</b>!
```

The main determinant for formatting is how you space your lines. Every new line matters, so be careful when you press enter.

### Headings and Paragraphs
Every heading is separated from any previous text by 2 blank lines, the very first line being an exception because it is a heading by default. Each paragraph below a heading is preceeded by 1 blank line and is bullet-pointed by default. For example:
```
Here is a heading that will be bold

Some text
Some more text in the same paragraph (but on a new line).

Other text in a new paragraph (but under the same heading).


Here is another heading!

Text under this new heading
```
Will look like this:

<b>Here is a heading that will be bold</b>

- Some text<br/>Some more text in the same paragraph (but on a new line).

- Other text in a new paragraph (but under the same heading).


<b>Here is another heading!</b>

- Text under this new heading

### Removing Bullet Points
Paragraphs have bullet points by default, but you can disable them by appending a minus `-` to their heading. For example:
```
Here is a heading-

This paragraph will not have a bullet point!
```

### Bold Text
For convenience, you can append a plus `+` to any line to make that line bold. For example:
```
This is the first line of a paragraph. It's not bold.
This line has a plus sign at the end so it will be bold!+
```

### Links
A hyperlink (like [this](#general)) is written as:
```
[Link Text]{Link Url}
e.g. Here is a [link to Google]{https://google.com}
```
If `Link Text` is omitted, the `Link Url` is used in its place.
