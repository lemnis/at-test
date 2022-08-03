exports['Ol @html/ol: MUST convey its role @role 1'] = {
  "role": "list",
  "name": "",
  "children": [
    {
      "role": "listitem",
      "name": "1. Cats 1. Big cat 2. Small cat",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "1. "
        },
        {
          "role": "text leaf",
          "name": "Cats "
        },
        {
          "role": "list",
          "name": "",
          "children": [
            {
              "role": "listitem",
              "name": "1. Big cat",
              "level": 2,
              "children": [
                {
                  "role": "list item marker",
                  "name": "1. "
                },
                {
                  "role": "text leaf",
                  "name": "Big cat"
                }
              ]
            },
            {
              "role": "listitem",
              "name": "2. Small cat",
              "level": 2,
              "children": [
                {
                  "role": "list item marker",
                  "name": "2. "
                },
                {
                  "role": "text leaf",
                  "name": "Small cat"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "role": "listitem",
      "name": "2. Dogs",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "2. "
        },
        {
          "role": "text leaf",
          "name": "Dogs"
        }
      ]
    },
    {
      "role": "listitem",
      "name": "3. Birds",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "3. "
        },
        {
          "role": "text leaf",
          "name": "Birds"
        }
      ]
    }
  ]
}
