exports['reportValidity() @js/reportvalidity: Should show validity & focus first invalid element @showAndFocus 1'] = {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "form",
      "name": "",
      "invalid": true,
      "children": [
        {
          "role": "label",
          "name": "Email foo",
          "children": [
            {
              "role": "text leaf",
              "name": "Email "
            },
            {
              "role": "textbox",
              "name": "Email",
              "focused": true,
              "required": true,
              "invalid": true,
              "children": [
                {
                  "role": "text leaf",
                  "name": "foo"
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

exports['setCustomValidity() @js/setCustomValidity: Should show custom error & focus first invalid element @showAndFocus 1'] = {
  "role": "document",
  "name": "",
  "children": [
    {
      "role": "form",
      "name": "",
      "invalid": true,
      "children": [
        {
          "role": "label",
          "name": "Name",
          "children": [
            {
              "role": "text leaf",
              "name": "Name "
            },
            {
              "role": "textbox",
              "name": "Name",
              "focused": true,
              "invalid": true
            }
          ]
        },
        {
          "role": "text leaf",
          "name": " "
        },
        {
          "role": "label",
          "name": "Email",
          "children": [
            {
              "role": "text leaf",
              "name": "Email "
            },
            {
              "role": "textbox",
              "name": "Email"
            }
          ]
        }
      ]
    }
  ]
}
