exports['Figure @html/figure: Should be targetable @targetable 1'] = {
  "role": "figure",
  "name": "",
  "children": [
    {
      "role": "TextGroup",
      "name": "",
      "children": [
        {
          "role": "image",
          "name": "Kitten"
        }
      ]
    },
    {
      "role": "Group",
      "name": "",
      "children": [
        {
          "role": "text",
          "name": "Some caption about the kitten"
        }
      ]
    }
  ]
}

exports['Figure @html/figure: Should have empty name when missing caption @nameMissingFigcaption 1'] = {
  "role": "figure",
  "name": "",
  "children": [
    {
      "role": "image",
      "name": "Kitten"
    }
  ]
}
