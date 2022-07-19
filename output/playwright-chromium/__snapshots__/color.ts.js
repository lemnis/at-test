exports['Color @html/input/color: Should be targetable when having a label @targetable 1'] = {
  "role": "ColorWell",
  "name": "Label",
  "value": "#000000"
}

exports['Color @html/input/color: Should be targetable when having a label @targetable 2'] = {
  "role": "ColorWell",
  "name": "Label",
  "focused": true,
  "children": [
    {
      "role": "WebArea",
      "name": "",
      "children": [
        {
          "role": "slider",
          "name": "Color well",
          "roledescription": "Color well with two-dimensional slider for selecting saturation and lightness",
          "valuetext": "X: 0, Y: 136",
          "focused": true,
          "valuemax": 32016,
          "valuemin": 0,
          "orientation": "horizontal",
          "value": 31416
        },
        {
          "role": "button",
          "name": "Eyedropper"
        },
        {
          "role": "slider",
          "name": "Hue slider",
          "valuetext": "",
          "valuemax": 129,
          "valuemin": 0,
          "orientation": "horizontal",
          "value": 0
        },
        {
          "role": "textbox",
          "name": "Red channel",
          "value": "0"
        },
        {
          "role": "textbox",
          "name": "Green channel",
          "value": "0"
        },
        {
          "role": "textbox",
          "name": "Blue channel",
          "value": "0"
        },
        {
          "role": "spinbutton",
          "name": "Format toggler",
          "valuetext": "",
          "valuemax": 3,
          "valuemin": 1,
          "value": 1
        }
      ]
    }
  ],
  "value": "#000000"
}
