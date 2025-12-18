---
layout: default
title: Crime Trend Analysis
date: 2025-12-18
tags: non-fiction essay data-visualization
---
Here's my analysis of crime data...

<div id="vis"></div>

<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>

<script type="text/javascript">
  var spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 600,
    "height": {"step": 25},
    "padding": 5,
    "autosize": {"type": "fit-x", "contains": "padding"},

    "title": {
      "text": "Crime Rate per 100k",
      "fontSize": 18,
      "anchor": "start",
      "offset": 10
    },
    
    "signals": [
      {
        "name": "selectedYear",
        "value": 2024,
        "bind": {
          "input": "range",
          "min": 2016,
          "max": 2024,
          "step": 1,
          "name": "Year: "
        }
      },
      {
        "name": "sortOption",
        "value": "total",
        "bind": {
          "input": "select",
          "options": ["alphabetical", "violent", "property", "total"],
          "labels": ["Alphabetical", "Violent Crime", "Property Crime", "Total Crime"],
          "name": "Sort by: "
        }
      },
      {
        "name": "showViolent",
        "value": true,
        "bind": {"input": "checkbox", "name": "Show Violent Crime "}
      },
      {
        "name": "showProperty",
        "value": true,
        "bind": {"input": "checkbox", "name": "Show Property Crime "}
      }
    ],
    
    "data": [
      {
        "name": "source",
        "url": "/data/crime_year.csv",
        "format": {"type": "csv", "parse": "auto"}
      },
      {
        "name": "filtered",
        "source": "source",
        "transform": [
          {"type": "filter", "expr": "datum.year == selectedYear"}
        ]
      },
      {
        "name": "ranked",
        "source": "filtered",
        "transform": [
          {
            "type": "window",
            "sort": {"field": "total_crime_proportion", "order": "ascending"},
            "ops": ["rank"],
            "as": ["rank"]
          }
        ]
      },
      {
        "name": "longFormat",
        "source": "ranked",
        "transform": [
          {
            "type": "fold",
            "fields": ["vcrimes_proportion", "pcrimes_proportion"],
            "as": ["crimeType", "value"]
          },
          {
            "type": "formula",
            "as": "crimeTypeLabel",
            "expr": "datum.crimeType == 'vcrimes_proportion' ? 'Violent' : 'Property'"
          },
          {
            "type": "formula",
            "as": "shouldShow",
            "expr": "(datum.crimeTypeLabel == 'Violent' && showViolent) || (datum.crimeTypeLabel == 'Property' && showProperty)"
          },
          {"type": "filter", "expr": "datum.shouldShow"}
        ]
      },
      {
        "name": "stacked",
        "source": "longFormat",
        "transform": [
          {
            "type": "stack",
            "groupby": ["state"],
            "field": "value",
            "sort": {"field": "crimeTypeLabel", "order": "descending"},
            "as": ["v0", "v1"]
          },
          {
            "type": "formula",
            "as": "sortValue",
            "expr": "sortOption == 'alphabetical' ? datum.state : sortOption == 'violent' ? datum.vcrimes_proportion : sortOption == 'property' ? datum.pcrimes_proportion : datum.total_crime_proportion"
          }
        ]
      }
    ],
    
    "scales": [
      {
        "name": "y",
        "type": "band",
        "domain": {
          "data": "stacked",
          "field": "state",
          "sort": {
            "field": "sortValue",
            "op": "max",
            "order": "ascending"
          }
        },
        "range": "height",
        "padding": 0.1
      },
      {
        "name": "x",
        "type": "linear",
        "domain": [0, 5000],
        "range": "width",
        "nice": true
      },
      {
        "name": "color",
        "type": "ordinal",
        "domain": ["Violent", "Property"],
        "range": ["#708090", "#8FBC8F"]
      }
    ],
    
    "axes": [
      {
        "orient": "bottom",
        "scale": "x",
        "title": null,
        "grid": false
      },
      {
        "orient": "left",
        "scale": "y",
        "title": null,
        "grid": false
      }
    ],
    
    "legends": [
      {
        "fill": "color",
        "title": null,
        "orient": "bottom",
        "direction": "horizontal",
        "padding": 10,
        "offset": 0
      }
    ],
    
    "marks": [
      {
        "type": "rect",
        "from": {"data": "stacked"},
        "encode": {
          "enter": {
            "y": {"scale": "y", "field": "state"},
            "height": {"scale": "y", "band": 1},
            "x": {"scale": "x", "field": "v0"},
            "x2": {"scale": "x", "field": "v1"},
            "fill": {"scale": "color", "field": "crimeTypeLabel"},
            "tooltip": {
              "signal": "{'State': datum.state, 'Total Crime per 100k': format(datum.total_crime_proportion, ',.0f'), 'Rank': datum.rank}"
            }
          }
        }
      }
    ]
  };
  vegaEmbed('#vis', spec, {actions: false}).catch(console.error);
</script>

More analysis text continues here...