exports['Details @html/details: Should hide / show content depending on expanded state @hideContent 1'] = {
  "role": "ScrollArea",
  "name": "",
  "orientation": "horizontal",
  "children": [
    {
      "role": "WebArea",
      "name": "",
      "children": [
        {
          "role": "TextGroup",
          "name": "",
          "children": [
            {
              "role": "button",
              "name": "start"
            }
          ]
        },
        {
          "role": "Details",
          "name": "",
          "children": [
            {
              "role": "Summary",
              "name": "",
              "children": [
                {
                  "role": "text",
                  "name": "Summary title"
                }
              ]
            }
          ]
        },
        {
          "role": "TextGroup",
          "name": "",
          "children": [
            {
              "role": "button",
              "name": "end"
            }
          ]
        }
      ]
    }
  ]
}

exports['Details @html/details: Should hide / show content depending on expanded state @hideContent 2'] = {
  "role": "ScrollArea",
  "name": "",
  "orientation": "horizontal",
  "children": [
    {
      "role": "WebArea",
      "name": "",
      "children": [
        {
          "role": "Details",
          "name": "",
          "children": [
            {
              "role": "Summary",
              "name": "",
              "focused": true,
              "children": [
                {
                  "role": "text",
                  "name": "Summary title"
                }
              ]
            },
            {
              "role": "TextGroup",
              "name": "",
              "children": [
                {
                  "role": "text",
                  "name": "Lorem ipsum dolor sit amet."
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
