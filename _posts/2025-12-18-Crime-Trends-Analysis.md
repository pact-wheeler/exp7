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
    "width": "container",
    "height": 1400,
    "padding": 5,
    "autosize": {"type": "fit", "contains": "padding"},
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
        "url": "/assets/data/exp7/crime_year.csv",
        "format": {"type": "csv", "parse": "auto"}
      },
      {
        "name": "filtered",
        "source": "source",
        "transform": [
          {"type": "filter", "expr": "datum.Year == selectedYear"}
        ]
      },
      {
        "name": "ranked",
        "source": "filtered",
        "transform": [
          {
            "type": "window",
            "sort": {"field": "Total Crime per 100k", "order": "ascending"},
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
            "fields": ["Violent Crimes per 100k", "Property Crimes per 100k"],
            "as": ["crimeType", "value"]
          },
          {
            "type": "formula",