exports['HTMLDialogElement @api/HTMLDialogElement: When closed it and his children should be ignored @closed 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Button outside modal"
    }
  ]
}

exports['HTMLDialogElement @api/HTMLDialogElement: When opened as modal only his children should be visiblein the accessibility tree @showAndFocus 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Button inside modal",
      "focused": true
    }
  ]
}

exports['HTMLDialogElement @api/HTMLDialogElement: When opened normally the accessibility tree should include all elements @showAndFocus 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Button inside modal",
      "focused": true
    },
    {
      "role": "button",
      "name": "Button outside modal"
    }
  ]
}

exports['HTMLDialogElement @api/HTMLDialogElement: Pressing Escape should hide the modal @pressEscape 1'] = {
  "role": "WebArea",
  "name": "",
  "children": [
    {
      "role": "button",
      "name": "Button outside modal"
    }
  ]
}
