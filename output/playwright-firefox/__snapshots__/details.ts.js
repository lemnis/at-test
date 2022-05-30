exports['Details @html/details: Should hide / show content depending on expanded state @hideContent 1'] = {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "details",
      "name": "",
      "children": [
        {
          "role": "summary",
          "name": "Summary title",
          "children": [
            {
              "role": "text leaf",
              "name": "Summary title"
            }
          ]
        }
      ]
    }
  ]
}

exports['Details @html/details: Should hide / show content depending on expanded state @hideContent 2'] = {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "details",
      "name": "",
      "children": [
        {
          "role": "summary",
          "name": "▾ Summary title",
          "expanded": true,
          "focused": true,
          "children": [
            {
              "role": "statictext",
              "name": "▾ "
            },
            {
              "role": "text leaf",
              "name": "Summary title"
            }
          ]
        },
        {
          "role": "text leaf",
          "name": "Lorem ipsum dolor sit amet. "
        }
      ]
    }
  ]
}
