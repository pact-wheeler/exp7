---
layout: default
title: How to Software
permalink: /software/
date: 2025-03-26
tags: non-fiction
---

- Change your default search to Kagi

  - [Here's the link](https://help.kagi.com/kagi/getting-started/setting-default.html#chromium_desktop), your instructions might be different than mine depending on what device you use.

- Excel

  - Highlight every other row with conditional formatting
    - =AND(MOD(ROW(CellRef),2)=0, NOT(ISBLANK(CellRef)))
    - With any conditional formatting (and dynamic arrays, for that matter) you're looking for each cell within a range to return either TRUE or FALSE. 
  - Process for Excel workbooks
    - Create an excel model and have as many tables in, don't worry too much about what tables you're referencing, get it working
    - When doing a final version of the Excel modle

- Power Query

  - Refer to column by index

    - [Here's the link](https://stackoverflow.com/questions/50113354/how-to-refer-columns-in-power-query-by-index-or-position) 

    - Code is 

      ```
      Table.ColumnNames(MyTable){n}
      ```

  - Refer to sheet by index

    - [Here's the link](https://sqlryan.com/2019/06/import-first-sheet-of-an-excel-workbook-into-power-query-regardless-of-its-name/)

    - Code is 

      - In

        ```
        #PrevStep = Source{[Item="Dan's Sheet", Kind="Sheet1"]},[Data],
        ```

        Replace 

        ```
        Item="Bob's Sheet"
        ```

        with 

        ```
        Item=Source{0}[Item]
        ```

        Remember, it's a 0 based index.

  - Best Practice is to rename auto generated step names

- Markdown is all you need for most writing

  - I use [Typora](https://typora.io/), - it was <$20. You [should buy software](https://danielphayward.com/tanstaafl) that you use, generally.
    - Features I use all the time
      - Ordered and unordered Lists
      - Headings
      - Bold, italic, links, quotes, parenthesis
        - In Typora, I can highlight something and it will do that. Ctrl-K takes a link that is on your clipboard and applies it to whatever text is highlighted, this is an amazingly simple operation that saves me time and effort. Highlighting some text and then typing a parenthesis will put all of the highlighted text in parentheses. If I am anywhere in a line and I hit tab, while in a list, it will indent that section of text. Simple quality of life stuff. 

- Charts

  - Clean up charts:  
    1. Remove chart borders  
    2. Remove or de-emphasize gridlines  
    3. Clean up axes labels  
    4. Label data directly when appropriate  
    5. Leverage consistent color
