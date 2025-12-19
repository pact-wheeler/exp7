---
layout: default
title: Crime Trend Analysis
date: 2025-12-18
tags: non-fiction essay data-visualization
---
Here's my analysis of crime data...4:00PM

<div id="vis"></div>

<script src="https://cdn.jsdelivr.net/npm/vega@5"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>

<script type="text/javascript">
  var spec = {
    "$schema": "https://vega.github.io/schema/vega/v5.json",
    "width": 600,
    "height": {"step": 25},
    "padding": 5,

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
        "format": {"type": "csv", "parse": "auto"},
        "transform": [
          {"type": "filter", "expr": "datum.year == selectedYear"},
          {
            "type": "window",
            "sort": {"field": "total_crime_proportion", "order": "ascending"},
            "ops": ["rank"],
            "as": ["rank"]
          },
          {
            "type": "formula",
            "as": "violent_for_sort",
            "expr": "datum.vcrimes_proportion"
          },
          {
            "type": "formula",
            "as": "property_for_sort",
            "expr": "datum.pcrimes_proportion"
          },
          {
            "type": "formula",
            "as": "total_for_sort",
            "expr": "datum.total_crime_proportion"
          }
        ]
      },
      {
        "name": "bars",
        "source": "source",
        "transform": [
          {
            "type": "fold",
            "fields": ["vcrimes_proportion", "pcrimes_proportion"],
            "as": ["crime_type", "crime_value"]
          },
          {
            "type": "formula",
            "as": "type_label",
            "expr": "datum.crime_type == 'vcrimes_proportion' ? 'Violent' : 'Property'"
          },
          {
            "type": "formula",
            "as": "show_this",
            "expr": "(datum.type_label == 'Violent' && showViolent) || (datum.type_label == 'Property' && showProperty)"
          },
          {"type": "filter", "expr": "datum.show_this"},
          {
            "type": "formula",
            "as": "sort_key",
            "expr": "sortOption == 'alphabetical' ? datum.state : sortOption == 'violent' ? datum.violent_for_sort : sortOption == 'property' ? datum.property_for_sort : datum.total_for_sort"
          },
          {
            "type": "stack",
            "groupby": ["state"],
            "field": "crime_value",
            "sort": {"field": "type_label", "order": "descending"},
            "as": ["y0", "y1"]
          }
        ]
      }
    ],
    
    "scales": [
      {
        "name": "yscale",
        "type": "band",
        "domain": {
          "data": "bars",
          "field": "state",
          "sort": {"field": "sort_key", "op": "max", "order": "ascending"}
        },
        "range": "height",
        "padding": 0.1
      },
      {
        "name": "xscale",
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
        "scale": "xscale",
        "title": null,
        "grid": false
      },
      {
        "orient": "left",
        "scale": "yscale",
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
        "from": {"data": "bars"},
        "encode": {
          "enter": {
            "y": {"scale": "yscale", "field": "state"},
            "height": {"scale": "yscale", "band": 1},
            "x": {"scale": "xscale", "field": "y0"},
            "x2": {"scale": "xscale", "field": "y1"},
            "fill": {"scale": "color", "field": "type_label"},
            "tooltip": {
              "signal": "{'State': datum.state, 'Total Crime per 100k': format(datum.total_for_sort, ',.0f'), 'Rank': datum.rank}"
            }
          }
        }
      }
    ]
  };
  vegaEmbed('#vis', spec, {actions: false}).catch(console.error);
</script>

More analysis text continues here...
