---
layout: default
title: Crime Trend Analysis
date: 2025-12-19
tags: non-fiction essay data-visualization
---

I saw a post from someone about the reason that so many were moving from Washington to Idaho was because of how much safer it was. They cited this [FBI database](https://cde.ucr.cjis.gov/LATEST/webapp/#/pages/explorer/crime/query) as a reference and combined both property and violent crime as their source.

But violent crime and property crime are wildly different. It's an entirely different experience for you to be held up at gun point and having your car stolen. One of them is dangerous and one of them isn't. There is also the problem of context. Most people couldn't tell you why crimes are per 100,000 population or if 200 violent crimes per 100,000 people is a lot or not very much. Are things better or worse than 10 years ago?

<div id="vis1"></div>
<script src="https://cdn.jsdelivr.net/npm/vega@6"></script>
<script src="https://cdn.jsdelivr.net/npm/vega-embed@6"></script>
<script type="text/javascript">
  var spec1 = {
    "$schema": "https://vega.github.io/schema/vega/v6.json",
    "width": 800,
    "height": 600,
    "padding": 5,
    "title": {
      "text": "Crime Rate per 100k",
      "fontSize": 18,
      "anchor": "start",
      "offset": 10
    },
    "signals": [
      {
        "name": "triggerUpdate",
        "update": "sortOption + showViolent + showProperty"
      },
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
          },
          {
            "type": "formula",
            "as": "sort_key",
            "expr": "triggerUpdate && (sortOption == 'alphabetical' ? datum.state : sortOption == 'violent' ? datum.violent_for_sort : sortOption == 'property' ? datum.property_for_sort : datum.total_for_sort)"
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
            "type": "stack",
            "groupby": ["state"],
            "field": "crime_value",
            "offset": "zero",
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
        "data": "source",
        "field": "state",
        "sort": {"field": "sort_key", "order": "ascending"}
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
    ]};
      vegaEmbed('#vis1', spec1, {actions: false}).catch(console.error);
    </script>
So here's some context, you can obviously scroll through the years but to look at all the data at once below gives you particular context for 2024

<div id="vis2"></div>

<script type="text/javascript">
  var spec2 = {
    "$schema": "https://vega.github.io/schema/vega/v6.json",
    "width": 800,
    "height": 600,
    "padding": 5,
    "title": {
      "text": "Crime Rates per 100k by State and Year",
      "fontSize": 18,
      "anchor": "start",
      "offset": 10
    },
    "signals": [
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
      "format": {
        "type": "csv",
        "parse": {
          "year": "number",
          "vcrimes_proportion": "number",
          "pcrimes_proportion": "number"
        }
      }
    },
      {
        "name": "violent",
        "source": "source",
        "transform": [
          {"type": "filter", "expr": "showViolent"},
          {
            "type": "formula",
            "as": "crime_type",
            "expr": "'Violent'"
          },
          {
            "type": "formula",
            "as": "crime_rate",
            "expr": "datum.vcrimes_proportion"
          }
        ]
      },
      {
        "name": "property",
        "source": "source",
        "transform": [
          {"type": "filter", "expr": "showProperty"},
          {
            "type": "formula",
            "as": "crime_type",
            "expr": "'Property'"
          },
          {
            "type": "formula",
            "as": "crime_rate",
            "expr": "datum.pcrimes_proportion"
          }
        ]
      }
    ],
    "scales": [
    {
      "name": "xscale",
      "type": "linear",
      "domainMin": 2016,
      "domainMax": 2024,
      "range": "width"
    },
      {
        "name": "yscale",
        "type": "linear",
        "domain": {"data": "source", "fields": ["vcrimes_proportion", "pcrimes_proportion"]},
        "range": "height",
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
        "format": "d"
      },
      {
        "orient": "left",
        "scale": "yscale",
      }
    ],
    "legends": [
      {
        "fill": "color",
        "title": null,
        "orient": "bottom",
        "direction": "horizontal"
      }
    ],
    "marks": [
      {
        "type": "symbol",
        "from": {"data": "violent"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "year"},
            "y": {"scale": "yscale", "field": "crime_rate"},
            "fill": {"scale": "color", "field": "crime_type"},
            "size": {"value": 50},
            "opacity": {"value": 0.7},
            "tooltip": {
              "signal": "datum.state + '\\n' + datum.year + '\\n' + 'Violent Crime' + '\\n' + format(datum.crime_rate, ',.2f')"
            }
          }
        }
      },
      {
        "type": "symbol",
        "from": {"data": "property"},
        "encode": {
          "enter": {
            "x": {"scale": "xscale", "field": "year"},
            "y": {"scale": "yscale", "field": "crime_rate"},
            "fill": {"scale": "color", "field": "crime_type"},
            "size": {"value": 50},
            "opacity": {"value": 0.7},
            "tooltip": {
              "signal": "datum.state + '\\n' + datum.year + '\\n' + 'Violent Crime' + '\\n' + format(datum.crime_rate, ',.2f')"
            }
          }
        }
      }
    ]
  };
  vegaEmbed('#vis2', spec2, {actions: false}).catch(console.error);
</script>