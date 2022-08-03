exports['Li @html/li: MUST convey its role in ordered list @role 1'] = {
  "role": "listitem",
  "name": "1. Cats",
  "children": [
    {
      "role": "list item marker",
      "name": "1. "
    },
    {
      "role": "text leaf",
      "name": "Cats"
    }
  ]
}

exports['Li @html/li: MUST convey its role in unordered list @role 1'] = {
  "role": "listitem",
  "name": "• Cats",
  "children": [
    {
      "role": "list item marker",
      "name": "• "
    },
    {
      "role": "text leaf",
      "name": "Cats"
    }
  ]
}
