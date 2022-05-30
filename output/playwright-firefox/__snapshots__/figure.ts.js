exports['Figure @html/figure: Should be targetable @targetable 1'] = {
  "role": "figure",
  "name": "Some caption about the kitten",
  "children": [
    {
      "role": "img",
      "name": "Kitten"
    },
    {
      "role": "paragraph",
      "name": "",
      "children": [
        {
          "role": "text leaf",
          "name": "Non-image figure content"
        }
      ]
    },
    {
      "role": "caption",
      "name": "",
      "children": [
        {
          "role": "text leaf",
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
      "role": "img",
      "name": "Kitten"
    },
    {
      "role": "paragraph",
      "name": "",
      "children": [
        {
          "role": "text leaf",
          "name": "Non-image figure content"
        }
      ]
    }
  ]
}
