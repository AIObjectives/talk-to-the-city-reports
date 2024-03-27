The translate node translates JSON documents to multiple target languages, and takes the following settings:

## Input attributes:

- input_language

The language of the JSON document being passed in.

- target_languages

The languages the document is translated to.

- language_selector

The language used as output for the `translation` output attribute.

## Output attributes:

- translation

This attribute will either output the language as defined by the `language_selector` input attribute, or the first language found in the `translations` object (if no `language_selector` was specified).

- translations

This attribute ouputs all languages in an object (the language codes as keys, and translation objects as values).

## Storage

The resulting JSON document is stored in a Google Cloud Storage bucket. The bucket is automatically created when the node is first run. The file is saved in `uploads/{user-id}/{report-path}`. The file is automatically deleted when the node or report are deleted.
