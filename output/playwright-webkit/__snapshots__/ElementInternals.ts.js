exports['reportValidity() @js/reportvalidity: Should show validity & focus first invalid element @showAndFocus 1'] = {
  "role": "ScrollArea",
  "name": "",
  "orientation": "horizontal",
  "children": [
    {
      "role": "WebArea",
      "name": "",
      "children": [
        {
          "role": "form",
          "name": "",
          "children": [
            {
              "role": "Label",
              "name": "",
              "children": [
                {
                  "role": "text",
                  "name": "Email "
                },
                {
                  "role": "textbox",
                  "name": "Email foo",
                  "roledescription": "email field",
                  "focused": true,
                  "required": true,
                  "invalid": "true",
                  "children": [
                    {
                      "role": "Div",
                      "name": ""
                    }
                  ],
                  "value": "foo"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}

exports['setCustomValidity() @js/setCustomValidity: Should show custom error & focus first invalid element @showAndFocus 1'] = {
  "role": "ScrollArea",
  "name": "",
  "orientation": "horizontal",
  "children": [
    {
      "role": "WebArea",
      "name": "",
      "children": [
        {
          "role": "form",
          "name": "",
          "children": [
            {
              "role": "Label",
              "name": "",
              "children": [
                {
                  "role": "text",
                  "name": "Name "
                },
                {
                  "role": "textbox",
                  "name": "Name",
                  "focused": true
                }
              ]
            },
            {
              "role": "Label",
              "name": "",
              "children": [
                {
                  "role": "text",
                  "name": "Email "
                },
                {
                  "role": "textbox",
                  "name": "Email",
                  "roledescription": "email field"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
