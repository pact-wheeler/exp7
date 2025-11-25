---
layout: default
title: Standards for Excel Modeling
date: 2025-10-10
tags: excel business
---

## Overall

> Excel models should be flexible, appropriate, structured, and transparent. 
>

This is cribbed from the FAST Standards found [here](https://www.fast-standard.org/) without permission. 

Any Excel modeler should be able to audit and explain what the workbook is calculating relatively quickly. With the pace and quantity of projects required for excel modelers, having standards increases efficiency and accuracy while modeling solutions. **It will slow you down to start.**

> Each worksheet is a chapter in the novel of your excel model.

There are four groups of sheets within each excel model: foundation, working sheets, checks, and presentations. 

The **foundation** consists of inputs and instructions, raw data, and organized raw data. Input and instruction sheets provide a description of the model’s flow, notes about colors, jargon or terms, and functions used in the model. As part of the instructions write out the model's weaknesses, and assumptions. You can include within the input/instructions or separately, but either way, provide a table of contents.

Include a dedicated comment column on input sheets. Either you will move onto another project and forget about each of the decisions you made or the model will be handed off. Having the context that information provides will be invaluable to the tool's longevity.

**Working sheets** include multiple calculation sheets, named appropriately given their purpose. Be rigorous about labelling each column as they're created. Review the logic constantly, leave temporary code as short as possible. 

**Check sheets** verify that your calculation blocks aren't excluding the data or counting any of it twice. Look for multiple ways to come to the same result for the final and intermediate calculations. At the very least, ensure that the sum is the same at the before and after your transformations. 

At the top of each sheet within the model (with the possible exclusion of the report/presentation page) have the outputs of check sheets in a freeze pane.

**Presentation sheets** summarize the final output of the calculation block. As often as not, it will just equal the range that the final output exists in with some formatting. When it makes sense include definitions of the units.

A model must completely explain how it works without the need for other software applications to present the model outputs. If you need a chart or graph, include that in the presentation sheet. Don't use excel defaults, it shows laziness. Instead create default formats for yourself and stick to those few charts, do not chase all the new functions and tools that Microsoft create, choose expertise in fewer tools. People err on the side of too complicated rather than too simple. A data table is incredibly informationally dense, your readers are smarter than you think. If you don't know how to present data, refer to Stephen Few's show me the numbers.

To reduce size and increase speed of the excel model use structured references and tables instead of range references when possible. Avoid volatile functions (CELL, INDIRECT, INFO, NOW, OFFSET, RAND, RANDARRAY, RANDBETWEEN, ROW, COLUMN, TODAY). For large datasets, prefer SUMIFS/COUNTIFS over multiple calculation blocks. Avoid nested formulas in almost all cases.

## General Workbook Design Principles

> Your excel model is a novel, it tells a specific story, accomplishes a particular result.

Use only one time ruler throughout the model if possible and freeze a column or row with it. Except in the report page, juxtapose secondary and primary time rulers. Never daisy chain links. Links should always go directly to the user input, or calculation throughout the book.

Use in-flow / out-flow convention on all sheets. Revenues should be positive, expenses are negative. Arrange sheets and calculations so that calculation order flows from left to right except to group Input and Results sheets, typically at the beginning.

Do not optimize workings and presentation in the same worksheet. You get the worst of both worlds when you do this and updating becomes difficult. Flags are [Boolean](https://en.wikipedia.org/wiki/George_Boole) values that determine whether a period of item counts for that calculation. Factors are any user inputs or constants that affect the calculation. Separate them, ideally into different sheets, if not, then into different blocks, and at the very least into different columns or rows.

Each working sheet should be contained with the end result on the far left or bottom of the data. Sheets should not be inter-linked overly much and should be marked. A single model should not be multiple workbooks with a few exceptions; when a data source gets updated regularly and that can easily dropped in a folder, and when multiple folks are working on a model.

Power Query is the default to pull in data from other files/folders. This helps reduce errors because the resulting table can then be referenced. For sheets and tables that are pulled from external sources, separate them from any working sheets. I typically mark them as "Raw" in the sheetname, even if the query does manipulate them.

## Calculation Blocks

> This is a paragraph in the novel of your excel model.

Calculation blocks follow this pattern: ingredients, flags, calculations, and result. Except when there are cascading calculation blocks where you'll have multiple calculation steps. This is better than long formulas for ease of debugging and explaining the model to others. Corkscrew calculation blocks are another exception, where the ending balance of one period is the beginning balance of another.

Series worksheets should be defined for a single time axis only. **What is a series?**

Make only two columns matter for each calculation block, by that I mean you should only have to check the constants and the calculation column. All other columns (or rows) should follow exactly the same formula. That's *part* of why each column should only contain one calculation or constant. (Credit: Mike Girvin), document formulas using the FORMULATEXT function, that way you can confirm multiple calculations without going into each one. This also will be benefited by shorter formulas and breaking calculations up.

Calculation logic should flow from top to bottom and left to right. Only use counter-flows opening balance positions, as the first ingredient within a calculation block. 

Do not hide anything unless it will be empty or always zero. You might have these if you have a time series that forces you to include a timeline that will always have zero values. This will be the exception.

Construct calculations in a separate calculation blocks except when the calculation block is a balance corkscrew or it is trivial. Sometimes you'll have a 2D calculation block, especially when dividing things by the same time series but over categories or you're summarizing by multiple criteria (viz. cost type and business line).

If you find yourself rebuilding similar calculation blocks save them for reuse. Order your calculation blocks in their order of importance. Each calculation sheets should follow a similar ordering.

List common calculation block components in a consistent order. List precedents in the order they appear in a formula. As a rule, use corkscrew calculation blocks for balance accumulation, keep the formulas short and use the sheet itself to do the calculation. 

Timing and factor flags are conditions that control whether certain conditions exist, use these outside of an IF formula (or nested IFs, **may it never be so**) so that you can easily see why you're getting a certain result from your IF function

Place display totals on the left or top within frozen frames where they are always visible.

Within your whole model, choose a capitalization convention and stick with it. If you don't what to select, choose sentence case, it's the superior choice.

## The Line Item

> This is the sentence in the novel of your excel model.

Provide a **good, unique** label for all line items, include a units designator (balance, cash or otherwise). Maintain labelling consistency pedantically and precisely. Label each row, each column, how it is calculated, if it's an opening or closing balance. Have default headers and sub-headers throughout your model. The way that I've done this is by having a macro sheet that I keep open most of the time with the formatting I use (more detail under the heading of *Format Rules*).

Do not use a series structure to present constant, i.e. do not repeat a constant, constantly on a line within a calculation block. It clutters the workspace and introduces more opportunity for error.

Do not use subtotals of rows or columns in model logic except at the end of a calculation block. 

Make numbers look like what they are with thoughtful formats. 

Formulas within columns must be consistent except when marked as temporary code; mark temporary code clearly with a yellow background. Examples of temporary code are 

Do not use partial range references, I can't think of a use case to do this intentionally except as a very temporary code, which would be marked as such.

Reduce the number of functions that you use within excel and shorten your formulas, leverage the worksheet itself to do the work. No formula should take more than 30 seconds to explain what it's goal is and how it does it. If it does, ask yourself if there's a way to break it apart. [If you, like me, have become accustomed to writing more and more complex formulas, then this will require a big shift in your thinking. It's incredible what Excel can compute within a single cell, but just because we can, doesn't mean we should and I can't overemphasize the benefit of fast formula fixing after the excel model is regularly being used by others.]

To determine whether a time period would calculate or not, use relevant flags when they're needed. Include display totals on all flags to easily determine how often that particular condition is filtering rows/columns out.

## Formula Rules

Use flags to limit use of IF function. Flags are columns or rows that determine if a condition is met, usually timing but could be categories or thresholds. Use Excel names sparingly, they work best for data validation lists, user input, and constants. 

Be as clear as possible with what is happening within a formula. Do not use a space as a substitute for multiplication, it isn't clear what is happening and can be confusing. You can and sometimes should includes spaces between arguments in formulas as a formatting tool. Do not embed constants except for sign switches, with should be done with a "-1*" at the beginning of the formula. All other constants should refer to one of the foundation pages. Parentheses should be used for necessity and improving formula clarity (and that rarely). If you refer to another sheet while writing a formula, Excel will then include the sheet reference that the formula exists on, you should delete this.

Beware circularity or #ERRORs protected on inactive branch of IF function, breaking apart IFs into multiple columns helps prevent this.

Do not use a complete absolute reference when you only need to use an anchored column or row. 

## Excel Features Used in Modelling

Use the INDEX function over the CHOOSE function and generally, choose excel functions that allow for flexibilty unless you're writing temporary code.

Do not use the NPV function, it's broken and will not get you the result you want, or may get you the result you want but not in all cases. XNPV calculates correctly, but if you want to see exactly what's happening, break it out into a calculation block.

Thoughtfully use ROUND when needed, not at every step. You should only need to use ROUND at the end of a calculation sheet or when multiplying proportions against totals. Rarely, you will need to round intermediately to match another software.

## Format Rules

Here are the rules I follow for consistency and pedantry: mark exports with red font, imports with blue font, counter-flows with gray shade, user inputs with light yellow font. Consistently apply header and sub header column formatting. Include at least one empty column or row between calculation blocks. Do not merge cells, use Center across selections.


If you're interested in the macro / standards sheet that I use, here's the [link](google.com).
