exports['Ul @html/ul: MUST convey its role @role 1'] = {
  "role": "list",
  "name": "",
  "children": [
    {
      "role": "listitem",
      "name": "• Cats ◦ Big cat ◦ Small cat",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "• "
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
              "name": "◦ Big cat",
              "level": 2,
              "children": [
                {
                  "role": "list item marker",
                  "name": "◦ "
                },
                {
                  "role": "text leaf",
                  "name": "Big cat"
                }
              ]
            },
            {
              "role": "listitem",
              "name": "◦ Small cat",
              "level": 2,
              "children": [
                {
                  "role": "list item marker",
                  "name": "◦ "
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
      "name": "• Dogs",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "• "
        },
        {
          "role": "text leaf",
          "name": "Dogs"
        }
      ]
    },
    {
      "role": "listitem",
      "name": "• Birds",
      "level": 1,
      "children": [
        {
          "role": "list item marker",
          "name": "• "
        },
        {
          "role": "text leaf",
          "name": "Birds"
        }
      ]
    }
  ]
}
