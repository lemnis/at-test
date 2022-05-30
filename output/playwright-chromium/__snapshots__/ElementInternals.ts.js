exports['reportValidity() @js/reportvalidity: Should show validity & focus first invalid element @showAndFocus 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "alert",
      "name": "Please include an '@' in the email address. 'foo' is missing an '@'."
    },
    {
      "role": "none",
      "name": "",
      "children": [
        {
          "role": "none",
          "name": "",
          "children": [
            {
              "role": "Section",
              "name": "",
              "children": [
                {
                  "role": "LabelText",
                  "name": "",
                  "children": [
                    {
                      "role": "text",
                      "name": "Email"
                    },
                    {
                      "role": "textbox",
                      "name": "Email",
                      "focused": true,
                      "required": true,
                      "invalid": "true",
                      "children": [
                        {
                          "role": "generic",
                          "name": "",
                          "children": [
                            {
                              "role": "text",
                              "name": "foo"
                            }
                          ]
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
  ]
}

exports['setCustomValidity() @js/setCustomValidity: Should show custom error & focus first invalid element @showAndFocus 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "alert",
      "name": "Custom Error"
    },
    {
      "role": "none",
      "name": "",
      "children": [
        {
          "role": "none",
          "name": "",
          "children": [
            {
              "role": "Section",
              "name": "",
              "children": [
                {
                  "role": "LabelText",
                  "name": "",
                  "children": [
                    {
                      "role": "text",
                      "name": "Name"
                    },
                    {
                      "role": "textbox",
                      "name": "Name",
                      "focused": true,
                      "invalid": "true",
                      "children": [
                        {
                          "role": "generic",
                          "name": ""
                        }
                      ]
                    }
                  ]
                },
                {
                  "role": "LabelText",
                  "name": "",
                  "children": [
                    {
                      "role": "text",
                      "name": "Email"
                    },
                    {
                      "role": "textbox",
                      "name": "Email",
                      "children": [
                        {
                          "role": "generic",
                          "name": ""
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
